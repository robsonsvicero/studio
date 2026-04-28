import { PropertyForm } from '@/components/admin/property-form';

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cadastrar Novo Imóvel</h1>
        <p className="text-muted-foreground">Preencha os detalhes do imóvel abaixo.</p>
      </div>
      <PropertyForm />
    </div>
  );
}
