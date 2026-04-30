import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  if (!adminDb) return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });

  try {
    const snapshot = await adminDb.collection('contacts').get();
    const contacts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id || !adminDb) return NextResponse.json({ success: false }, { status: 400 });

  try {
    await adminDb.collection('contacts').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id || !adminDb) return NextResponse.json({ success: false }, { status: 400 });

  try {
    await adminDb.collection('contacts').doc(id).update({ status: 'read' });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
