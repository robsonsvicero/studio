import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(req: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const snapshot = await adminDb.collection('properties').orderBy('createdAt', 'desc').get();
    const properties = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(properties);
  } catch (error) {
    console.error('API Properties Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
