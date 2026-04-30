import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  if (!adminDb) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }

  try {
    const snapshot = await adminDb.collection('contacts').orderBy('createdAt', 'desc').get();
    const contacts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      };
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('API Contacts Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
