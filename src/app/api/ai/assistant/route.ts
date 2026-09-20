import { NextResponse } from 'next/server';
import { aiPropertyInquiryAssistant } from '@/ai/flows/ai-property-inquiry-assistant';

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    
    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const aiResult = await aiPropertyInquiryAssistant({ question });
    return NextResponse.json({ message: aiResult.answer });
  } catch (error) {
    console.error('API AI Assistant Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
