'use server';
/**
 * @fileOverview An AI flow to interpret natural language property search queries.
 *
 * - interpretSearchQuery - A function that handles query interpretation.
 * - InterpretSearchQueryInput - The input type for the function.
 * - InterpretSearchQueryOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretSearchQueryInputSchema = z.object({
  query: z.string().describe('The natural language search query from the user.'),
});
export type InterpretSearchQueryInput = z.infer<typeof InterpretSearchQueryInputSchema>;

const InterpretSearchQueryOutputSchema = z.object({
  propertyType: z.array(z.string()).optional().describe('The type(s) of property (e.g., "apartamento", "casa", "cobertura").'),
  location: z.string().optional().describe('The desired city, neighborhood or area.'),
  features: z.array(z.string()).optional().describe('Specific features or amenities mentioned (e.g., "vista para o parque", "aceita pet", "piscina").'),
  priceRange: z.string().optional().describe('The price range or budget mentioned.'),
  bedrooms: z.number().optional().describe('Number of bedrooms.'),
  summary: z.string().describe('A human-readable summary of the interpreted query.'),
});
export type InterpretSearchQueryOutput = z.infer<typeof InterpretSearchQueryOutputSchema>;

const interpretQueryPrompt = ai.definePrompt({
  name: 'interpretQueryPrompt',
  input: {schema: InterpretSearchQueryInputSchema},
  output: {schema: InterpretSearchQueryOutputSchema},
  prompt: `Você é um assistente de busca de imóveis. Sua tarefa é analisar a pesquisa em linguagem natural de um usuário e extrair os critérios de busca em um formato estruturado. O usuário está procurando imóveis em São Paulo e região.

Consulta do usuário: {{{query}}}

Analise a consulta e preencha os campos do JSON de saída. Para o campo 'summary', crie um resumo amigável e legível por humanos do que o usuário está procurando. Se um critério não for mencionado, omita o campo do JSON.`,
});

const interpretSearchQueryFlow = ai.defineFlow(
  {
    name: 'interpretSearchQueryFlow',
    inputSchema: InterpretSearchQueryInputSchema,
    outputSchema: InterpretSearchQueryOutputSchema,
  },
  async (input) => {
    const {output} = await interpretQueryPrompt(input);
    if (!output) {
      throw new Error('Failed to interpret search query.');
    }
    return output;
  }
);

export async function interpretSearchQuery(input: InterpretSearchQueryInput): Promise<InterpretSearchQueryOutput> {
  return interpretSearchQueryFlow(input);
}
