import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(req: Request) {
  try {
    const { filters } = await req.json();
    
    if (!adminDb) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    let query = adminDb.collection('properties');
    const snapshot = await query.get();
    
    let properties = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Aplicar filtros manualmente na API para flexibilidade
    if (filters) {
      if (filters.type && filters.type !== 'Todos') {
        properties = properties.filter(p => p.propertyType === filters.type);
      }
      if (filters.beds && filters.beds !== 'Qualquer') {
        const minBeds = parseInt(filters.beds);
        properties = properties.filter(p => (p.beds || 0) >= minBeds);
      }
      if (filters.priceRange) {
        properties = properties.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
      }
      // ... outros filtros (pet, furnished, etc)
      if (filters.petFriendly) {
        properties = properties.filter(p => p.petFriendly === true);
      }
      if (filters.furnished) {
        properties = properties.filter(p => p.furnished === true || p.furnished === 'Mobiliado');
      }
    }

    return NextResponse.json(properties);
  } catch (error) {
    console.error('API Search Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
