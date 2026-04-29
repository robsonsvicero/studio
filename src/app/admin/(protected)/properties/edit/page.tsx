'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { PropertyForm } from '@/components/admin/property-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditPropertyPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando dados do imóvel...</p>
      </div>
    );
  }

  if (!property && id) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Imóvel não encontrado</h1>
        <Button asChild variant="outline">
          <Link href="/admin/properties">Voltar para a lista</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/admin/properties" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para a lista
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Editar Imóvel</h1>
        <p className="text-muted-foreground">Atualize as informações do imóvel abaixo.</p>
      </div>

      <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
        <PropertyForm initialData={property} propertyId={id || undefined} />
      </div>
    </div>
  );
}
