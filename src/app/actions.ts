'use server';

import { aiPropertyInquiryAssistant } from '@/ai/flows/ai-property-inquiry-assistant';
import { z } from 'zod';

const AskQuestionSchema = z.object({
  question: z.string().min(5, 'A pergunta deve ter pelo menos 5 caracteres.'),
});

type State = {
  message?: string | null;
  error?: boolean;
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
