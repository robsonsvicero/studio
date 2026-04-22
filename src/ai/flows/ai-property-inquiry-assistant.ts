'use server';
/**
 * @fileOverview An AI assistant that answers natural language questions about property features, neighborhood information, or general real estate advice.
 *
 * - aiPropertyInquiryAssistant - A function that handles property inquiries.
 * - AiPropertyInquiryInput - The input type for the aiPropertyInquiryAssistant function.
 * - AiPropertyInquiryOutput - The return type for the aiPropertyInquiryAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the input schema for the AI property inquiry assistant.
 */
const AiPropertyInquiryInputSchema = z
  .object({
    question: z.string().describe('The natural language question from the user regarding properties, neighborhoods, or real estate advice.'),
  })
  .describe('Input for the AI property inquiry assistant, containing the user\'s question.');

export type AiPropertyInquiryInput = z.infer<typeof AiPropertyInquiryInputSchema>;

/**
 * Defines the output schema for the AI property inquiry assistant.
 */
const AiPropertyInquiryOutputSchema = z
  .object({
    answer: z.string().describe('A concise and relevant answer to the user\'s property-related question.'),
  })
  .describe('Output from the AI property inquiry assistant, providing the answer to the user\'s question.');

export type AiPropertyInquiryOutput = z.infer<typeof AiPropertyInquiryOutputSchema>;

const propertyInquiryPrompt = ai.definePrompt({
  name: 'propertyInquiryPrompt',
  input: { schema: AiPropertyInquiryInputSchema },
  output: { schema: AiPropertyInquiryOutputSchema },
  prompt: `Você é um assistente de IA especializado em imóveis. Sua função é responder a perguntas de usuários sobre características de imóveis, informações sobre bairros ou conselhos gerais sobre o mercado imobiliário. Forneça respostas concisas, relevantes e diretas.

Pergunta do usuário: {{{question}}}

Responda da melhor forma possível, mantendo a concisão.`,
});

const aiPropertyInquiryAssistantFlow = ai.defineFlow(
  {
    name: 'aiPropertyInquiryAssistantFlow',
    inputSchema: AiPropertyInquiryInputSchema,
    outputSchema: AiPropertyInquiryOutputSchema,
  },
  async (input) => {
    const { output } = await propertyInquiryPrompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI assistant.');
    }
    return output;
  }
);

/**
 * Invokes the AI property inquiry assistant to answer a natural language question.
 * @param input The user's question about properties, neighborhoods, or real estate advice.
 * @returns A concise and relevant answer from the AI assistant.
 */
export async function aiPropertyInquiryAssistant(
  input: AiPropertyInquiryInput
): Promise<AiPropertyInquiryOutput> {
  return aiPropertyInquiryAssistantFlow(input);
}
