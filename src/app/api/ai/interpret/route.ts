import { NextResponse } from 'next/server';
import { interpretSearchQuery } from '@/ai/flows/interpret-search-query-flow';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const aiResult = await interpretSearchQuery({ query });
    return NextResponse.json(aiResult);
  } catch (error) {
    console.error('API AI Interpret Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
