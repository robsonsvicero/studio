
/**
 * @fileOverview An AI concierge to qualify leads from the contact form.
 *
 * - aiConcierge - A function that handles the lead qualification.
 * - AiConciergeInput - The input type for the aiConcierge function.
 * - AiConciergeOutput - The return type for the aiConcierge function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiConciergeInputSchema = z.object({
  name: z.string().describe('The name of the user submitting the form.'),
  email: z.string().email().describe('The email of the user.'),
  message: z.string().describe("The user's initial message."),
});
export type AiConciergeInput = z.infer<typeof AiConciergeInputSchema>;

const AiConciergeOutputSchema = z.object({
  responseToUser: z.string().describe('A friendly, polite confirmation message to show back to the user.'),
  summaryForAgent: z.string().describe('A concise summary of the user\'s request for the real estate agent.'),
});
export type AiConciergeOutput = z.infer<typeof AiConciergeOutputSchema>;

const conciergePrompt = ai.definePrompt({
  name: 'aiConciergePrompt',
  input: {schema: AiConciergeInputSchema},
  output: {schema: AiConciergeOutputSchema},
  prompt: `Você é um concierge de IA para André Barbosa, um consultor imobiliário de alto padrão em São Paulo.

Um usuário enviou o formulário de contato. As informações dele são:
- Nome: {{name}}
- Email: {{email}}
- Mensagem: {{{message}}}

Sua tarefa é dupla:
1.  **Criar um resumo para o corretor (summaryForAgent):** Analise a mensagem do usuário e crie um resumo conciso e estruturado da solicitação dele. Inclua o que ele procura, a localização, o orçamento e qualquer outra preferência que ele tenha mencionado.
2.  **Escrever uma resposta para o usuário (responseToUser):** Escreva uma mensagem de confirmação amigável e educada para o usuário. Agradeça pelo contato. Confirme que a solicitação foi recebida e que André Barbosa entrará em contato em breve pelo email fornecido. Se o usuário fez uma pergunta direta, responda-a brevemente, se possível. Mantenha o tom profissional e cordial.

Responda estritamente no formato JSON solicitado.`,
});

const aiConciergeFlow = ai.defineFlow(
  {
    name: 'aiConciergeFlow',
    inputSchema: AiConciergeInputSchema,
    outputSchema: AiConciergeOutputSchema,
  },
  async (input) => {
    const {output} = await conciergePrompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI concierge.');
    }
    // In a real application, the `summaryForAgent` would be emailed or saved to a CRM.
    return output;
  }
);

export async function aiConcierge(input: AiConciergeInput): Promise<AiConciergeOutput> {
  return aiConciergeFlow(input);
}
