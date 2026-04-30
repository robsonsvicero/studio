import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { Resend } from 'resend';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const genAI = process.env.GOOGLE_GENAI_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY) : null;

const ContactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const validatedFields = ContactFormSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    });

    if (!validatedFields.success) {
      return NextResponse.json({
        errors: validatedFields.error.flatten().fieldErrors,
        submitted: false,
      });
    }

    const { name, email, message } = validatedFields.data;

    let responseToUser = 'Obrigado pelo contato! Recebemos sua mensagem e retornaremos em breve.';
    let summaryForAgent = 'Resumo da IA indisponível no momento.';

    // IA: Gerar resumo e resposta
    if (genAI) {
      try {
        console.log('Chamando Gemini API...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const prompt = `Você é um concierge para André Barbosa, corretor de imóveis em São Paulo.
O cliente "${name}" enviou a mensagem: "${message}".

Responda APENAS com um JSON válido (sem markdown, sem blocos de código) com dois campos:
- "summary": resumo objetivo do que o cliente quer, para o corretor (máximo 2 frases)
- "reply": resposta curta, gentil e profissional para o cliente confirmando o recebimento

Formato esperado: {"summary":"...","reply":"..."}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        console.log('Resposta da IA:', text.substring(0, 100));

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          summaryForAgent = parsed.summary || summaryForAgent;
          responseToUser = parsed.reply || responseToUser;
        }
      } catch (aiErr: any) {
        console.error('Erro na IA (não crítico):', aiErr.message);
      }
    } else {
      console.warn('GOOGLE_GENAI_API_KEY não configurada.');
    }

    // Salvar no Firestore
    if (adminDb) {
      await adminDb.collection('contacts').add({
        name, email, message,
        aiSummary: summaryForAgent,
        createdAt: new Date(),
        status: 'new',
      });
      console.log('Lead salvo no Firestore.');
    }

    // Enviar e-mail
    if (resend) {
      try {
        await resend.emails.send({
          from: 'André Barbosa Imóveis <onboarding@resend.dev>',
          to: 'contato@andrebarbosaimoveis.com.br',
          subject: `🆕 Novo Lead: ${name}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #4a5d4a;">Novo Contato Recebido!</h2>
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>E-mail:</strong> ${email}</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p><strong>Mensagem:</strong></p>
              <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #4a5d4a;">
                ${message}
              </blockquote>
              <div style="margin-top: 20px; padding: 15px; background: #efebe1; border-radius: 10px;">
                <p style="margin: 0; font-size: 12px; color: #666;"><strong>Resumo da IA:</strong></p>
                <p style="margin: 5px 0 0 0;">${summaryForAgent}</p>
              </div>
              <p style="margin-top: 30px;">
                <a href="https://andrebarbosaimoveis.com.br/admin/contacts"
                   style="background: #4a5d4a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  Ver no Painel Admin
                </a>
              </p>
            </div>
          `
        });
        console.log('E-mail enviado com sucesso.');
      } catch (mailErr: any) {
        console.error('Erro ao enviar e-mail:', mailErr.message);
      }
    }

    return NextResponse.json({
      response: responseToUser,
      summary: summaryForAgent,
      errors: null,
      submitted: true,
    });

  } catch (error: any) {
    console.error('Erro crítico na API de contato:', error.message);
    return NextResponse.json({
      response: 'Ocorreu um erro ao processar sua mensagem.',
      errors: null,
      submitted: false,
    }, { status: 500 });
  }
}
