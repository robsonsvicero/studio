import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

// Função para lidar com o CORS
function corsResponse(data: any, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Lidar com o Preflight do navegador (OPTIONS)
export async function OPTIONS() {
  return corsResponse({}, 200);
}

export async function GET() {
  if (!adminDb) return corsResponse({ error: 'Database not initialized' }, 500);

  try {
    const snapshot = await adminDb.collection('contacts').get();
    const contacts = snapshot.docs.map(doc => {
      const data = doc.data();
      let createdAt = new Date().toISOString();
      if (data.createdAt) {
        if (typeof data.createdAt.toDate === 'function') {
          createdAt = data.createdAt.toDate().toISOString();
        } else if (data.createdAt.seconds) {
          createdAt = new Date(data.createdAt.seconds * 1000).toISOString();
        } else {
          createdAt = new Date(data.createdAt).toISOString();
        }
      }

      return {
        id: doc.id,
        ...data,
        createdAt: createdAt
      };
    });
    return corsResponse(contacts);
  } catch (error) {
    return corsResponse({ error: 'Failed to fetch contacts' }, 500);
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id || !adminDb) return corsResponse({ success: false }, 400);

  try {
    await adminDb.collection('contacts').doc(id).delete();
    return corsResponse({ success: true });
  } catch (error) {
    return corsResponse({ success: false }, 500);
  }
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id || !adminDb) return corsResponse({ success: false }, 400);

  try {
    await adminDb.collection('contacts').doc(id).update({ status: 'read' });
    return corsResponse({ success: true });
  } catch (error) {
    return corsResponse({ success: false }, 500);
  }
}
