import { adminDb } from '@/lib/firebase/admin';
import { PropertyForm } from '@/components/admin/property-form';
import { notFound } from 'next/navigation';

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const doc = await adminDb.collection('properties').doc(id).get();

  if (!doc.exists) {
    notFound();
  }

  const initialData = doc.data();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Imóvel</h1>
        <p className="text-muted-foreground">Atualize as informações do imóvel.</p>
      </div>
      <PropertyForm initialData={initialData} propertyId={id} />
    </div>
  );
}
