import { aiPropertyInquiryAssistant } from '@/ai/flows/ai-property-inquiry-assistant';
import { aiConcierge } from '@/ai/flows/ai-concierge-flow';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase/admin';
import { InterpretSearchQueryOutput } from '@/ai/flows/interpret-search-query-flow';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const AskQuestionSchema = z.object({
  question: z.string().min(5, 'A pergunta deve ter pelo menos 5 caracteres.'),
});

const ContactFormSchema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
    email: z.string().email('Por favor, insira um email válido.'),
    message: z.string().min(10, 'A mensagem deve ter pelo menos 10 caracteres.'),
});


type State = {
  message?: string | null;
  error?: boolean;
};

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

export async function askAiAssistant(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = AskQuestionSchema.safeParse({
    question: formData.get('question'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.question?.join(', '),
      error: true,
    };
  }

  try {
    const result = await aiPropertyInquiryAssistant({ question: validatedFields.data.question });
    return { message: result.answer, error: false };
  } catch (e) {
    return { message: 'Ocorreu um erro ao contatar o assistente. Tente novamente mais tarde.', error: true };
  }
}

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

    try {
        const { responseToUser, summaryForAgent } = await aiConcierge(validatedFields.data);
        
        // Salva no Firestore se o banco estiver disponível
        if (adminDb) {
            await adminDb.collection('contacts').add({
                ...validatedFields.data,
                aiSummary: summaryForAgent,
                createdAt: new Date(),
                status: 'new'
            });
        }

        // Envia notificação por e-mail para o corretor se o Resend estiver configurado
        if (resend) {
            console.log('Iniciando envio de e-mail via Resend...');
            try {
                const mailData = await resend.emails.send({
                    from: 'André Barbosa Imóveis <contato@andrebarbosaimoveis.com.br>',
                    to: 'contato@andrebarbosaimoveis.com.br',
                    subject: `🆕 Novo Lead: ${validatedFields.data.name}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #4a5d4a;">Novo Contato Recebido!</h2>
                        <p><strong>Nome:</strong> ${validatedFields.data.name}</p>
                        <p><strong>E-mail:</strong> ${validatedFields.data.email}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p><strong>Mensagem:</strong></p>
                        <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #4a5d4a;">
                            ${validatedFields.data.message}
                        </blockquote>
                        <div style="margin-top: 20px; padding: 15px; background: #efebe1; rounded: 10px;">
                            <p style="margin: 0; font-size: 12px; color: #666;"><strong>Resumo da IA:</strong></p>
                            <p style="margin: 5px 0 0 0;">${summaryForAgent}</p>
                        </div>
                        <p style="margin-top: 30px; font-size: 14px;">
                            <a href="https://andrebarbosaimoveis.com.br/admin/contacts" style="background: #4a5d4a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                Ver no Painel Admin
                            </a>
                        </p>
                    </div>
                `
            });
            console.log('E-mail enviado com sucesso:', mailData);
        } catch (mailError) {
            console.error('Falha ao enviar e-mail de notificação:', mailError);
        }

        return { 
            response: responseToUser,
            summary: summaryForAgent,
            errors: null,
            submitted: true 
        };
    } catch (e) {
        return {
            response: 'Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.',
            errors: null,
            submitted: false,
        }
    }
}

export async function searchProperties(filters: InterpretSearchQueryOutput) {
  if (!adminDb) return [];
  
  try {
    const snapshot = await adminDb.collection('properties').get();
    let properties = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.().toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.().toISOString() || null,
      };
    });

    // Filtro por Tipo de Imóvel
    if (filters.propertyType && filters.propertyType.length > 0) {
      properties = properties.filter(p => 
        filters.propertyType!.some(type => 
          p.propertyType?.toLowerCase().includes(type.toLowerCase()) ||
          type.toLowerCase().includes(p.propertyType?.toLowerCase() || '')
        )
      );
    }

    // Filtro por Quartos
    if (filters.bedrooms) {
      properties = properties.filter(p => (Number(p.beds) || 0) >= filters.bedrooms!);
    }

    // Filtro por Localização
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      properties = properties.filter(p => 
        p.address?.toLowerCase().includes(loc) ||
        p.title?.toLowerCase().includes(loc) ||
        loc.includes(p.address?.toLowerCase() || '')
      );
    }

    // Filtro por Características (Features)
    if (filters.features && filters.features.length > 0) {
      properties = properties.filter(p => 
        filters.features!.some(feature => 
          p.description?.toLowerCase().includes(feature.toLowerCase()) ||
          p.title?.toLowerCase().includes(feature.toLowerCase())
        )
      );
    }

    return properties;
  } catch (error) {
    console.error('Error searching properties:', error);
    return [];
  }
}
