import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GOOGLE_GENAI_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY)
  : null;

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Fallback caso a IA não esteja disponível
    const fallback = {
      summary: `Buscando por: "${query}"`,
      propertyType: [],
      location: '',
      features: [],
    };

    if (!genAI) {
      return NextResponse.json(fallback);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const prompt = `Você é um assistente de busca de imóveis em São Paulo.
O usuário pesquisou: "${query}"

Analise e responda APENAS com um JSON válido (sem markdown) com estes campos opcionais:
- "propertyType": array de strings com tipos de imóvel mencionados (ex: ["apartamento"])
- "location": string com bairro/cidade mencionado
- "bedrooms": número de quartos mencionado
- "features": array de características mencionadas (ex: ["piscina", "garagem"])
- "summary": string com resumo amigável do que o usuário procura

Exemplo: {"propertyType":["apartamento"],"location":"Moema","bedrooms":3,"summary":"Apartamento com 3 quartos em Moema"}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch (aiErr: any) {
      console.error('AI interpret error (non-critical):', aiErr.message);
    }

    return NextResponse.json(fallback);

  } catch (error: any) {
    console.error('API AI Interpret Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
