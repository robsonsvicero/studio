'use server';

import { z } from 'zod';
import { adminDb } from '@/lib/firebase/admin';
import { InterpretSearchQueryOutput } from '@/ai/flows/interpret-search-query-flow';
import { Resend } from 'resend';
import { GoogleGenerativeAI } from '@google/generative-ai';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const genAI = process.env.GOOGLE_GENAI_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY) : null;

const ContactFormSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email('Por favor, insira um email válido.'),
  message: z.string().min(10, 'A mensagem deve ter pelo menos 10 caracteres.'),
});

type ContactState = {
  response?: string | null;
  summary?: string | null;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  } | null;
  submitted: boolean;
};

export async function submitContactForm(prevState: ContactState, formData: FormData): Promise<ContactState> {
  const validatedFields = ContactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      response: null,
      submitted: false,
    };
  }

  let responseToUser = 'Obrigado pelo contato! Recebemos sua mensagem e retornaremos em breve.';
  let summaryForAgent = 'Nenhum resumo disponível no momento.';

  try {
    // IA com a biblioteca oficial (mais estável)
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Você é um concierge para André Barbosa, corretor de imóveis. 
        O cliente ${validatedFields.data.name} enviou a mensagem: "${validatedFields.data.message}". 
        Responda em JSON com dois campos: 
        1. "summary": Um resumo curto do que o cliente quer para o corretor.
        2. "reply": Uma resposta curta e gentil para o cliente.
        Responda APENAS o JSON puro.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            summaryForAgent = data.summary || summaryForAgent;
            responseToUser = data.reply || responseToUser;
          }
        } catch (e) {
          console.warn('Erro ao parsear JSON da IA, usando texto puro.');
          summaryForAgent = text.substring(0, 200);
        }
      } catch (aiErr) {
        console.error('Erro na IA:', aiErr);
      }
    }

    // 1. Salvar no Firestore
    if (adminDb) {
      await adminDb.collection('contacts').add({
        ...validatedFields.data,
        aiSummary: summaryForAgent,
        createdAt: new Date(),
        status: 'new'
      });
    }

    // 2. Enviar E-mail
    if (resend) {
      try {
        await resend.emails.send({
          from: 'André Barbosa Imóveis <onboarding@resend.dev>',
          to: 'contato@andrebarbosaimoveis.com.br',
          subject: `🆕 Novo Lead: ${validatedFields.data.name}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #4a5d4a;">Novo Contato Recebido!</h2>
              <p><strong>Nome:</strong> ${validatedFields.data.name}</p>
              <p><strong>E-mail:</strong> ${validatedFields.data.email}</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p><strong>Mensagem Original:</strong></p>
              <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #4a5d4a;">
                ${validatedFields.data.message}
              </blockquote>
              <div style="margin-top: 20px; padding: 15px; background: #efebe1; border-radius: 10px;">
                <p style="margin: 0; font-size: 12px; color: #666;"><strong>Resumo da IA:</strong></p>
                <p style="margin: 5px 0 0 0;">${summaryForAgent}</p>
              </div>
              <p style="margin-top: 30px;">
                <a href="https://andrebarbosaimoveis.com.br/admin/contacts" style="background: #4a5d4a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  Ver no Painel
                </a>
              </p>
            </div>
          `
        });
      } catch (mailErr) {
        console.error('Erro e-mail:', mailErr);
      }
    }

    return {
      response: responseToUser,
      summary: summaryForAgent,
      errors: null,
      submitted: true
    };
  } catch (error) {
    console.error('Erro crítico:', error);
    return {
      response: 'Ocorreu um erro ao processar sua mensagem.',
      errors: null,
      submitted: false,
    };
  }
}

export async function deleteContact(id: string) {
  if (!adminDb) return { success: false };
  try {
    await adminDb.collection('contacts').doc(id).delete();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function markContactAsRead(id: string) {
  if (!adminDb) return { success: false };
  try {
    await adminDb.collection('contacts').doc(id).update({ status: 'read' });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
