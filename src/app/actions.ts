

import { aiPropertyInquiryAssistant } from '@/ai/flows/ai-property-inquiry-assistant';
import { aiConcierge } from '@/ai/flows/ai-concierge-flow';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase/admin';
import { InterpretSearchQueryOutput } from '@/ai/flows/interpret-search-query-flow';

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
        // In a real app, you would now email summaryForAgent to the agent or save to a CRM.
        return { 
            response: responseToUser,
            summary: summaryForAgent, // For potential debug/display
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
