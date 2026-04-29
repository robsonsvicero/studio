import { NextResponse } from 'next/server';
import { submitContactForm } from '@/app/actions';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const result = await submitContactForm(null, formData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Contact Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
