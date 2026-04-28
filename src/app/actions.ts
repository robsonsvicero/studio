'use server';

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
