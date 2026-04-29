'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BedDouble, 
  Bath, 
  Ruler, 
  CarFront, 
  MapPin, 
  MessageSquare,
  PawPrint,
  Building,
  Armchair,
  Loader2
} from 'lucide-react';
import { PropertyGallery } from '@/components/property-gallery';
import { Separator } from '@/components/ui/separator';
import { getApiUrl } from '@/lib/api-utils';

function PropertyDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [property, setProperty] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchProperty() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(getApiUrl(`/api/properties/single?id=${id}`));
        if (!response.ok) throw new Error('Property not found');
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Imóvel não encontrado</h1>
        <Button onClick={() => window.history.back()}>Voltar</Button>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price || 0);
  const whatsappNumber = "5511999998888";
  const whatsappMessage = encodeURIComponent(`Olá! Vi o imóvel "${property.title}" no seu site e gostaria de mais informações.`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <main className="flex-grow pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PropertyGallery images={property.images} title={property.title} />
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {property.transactionType?.toLowerCase() === 'venda' ? 'Venda' : 'Aluguel'}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {property.propertyType}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{property.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-lg">{property.address}</span>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-4">
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-xl space-y-2">
                <BedDouble className="h-6 w-6 text-primary" />
                <span className="text-sm text-muted-foreground">Quartos</span>
                <span className="font-bold text-lg">{property.beds || 0}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-xl space-y-2">
                <Bath className="h-6 w-6 text-primary" />
                <span className="text-sm text-muted-foreground">Banheiros</span>
                <span className="font-bold text-lg">{property.baths || 0}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-xl space-y-2">
                <CarFront className="h-6 w-6 text-primary" />
                <span className="text-sm text-muted-foreground">Vagas</span>
                <span className="font-bold text-lg">{property.parkingSpaces || 0}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-xl space-y-2">
                <Ruler className="h-6 w-6 text-primary" />
                <span className="text-sm text-muted-foreground">Área Útil</span>
                <span className="font-bold text-lg">{property.sqft || 0}m²</span>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Descrição do Imóvel</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
                {property.description}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-6 border rounded-2xl shadow-xl bg-card space-y-6">
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium uppercase text-xs tracking-wider">Valor do Investimento</span>
                <div className="text-3xl font-bold text-primary">{formattedPrice}</div>
              </div>
              <Button asChild className="w-full h-14 text-lg font-bold" size="lg">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="mr-2 h-6 w-6" />
                  TENHO INTERESSE
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PropertyDetailsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <React.Suspense fallback={
        <div className="flex-grow flex items-center justify-center pt-24">
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
        </div>
      }>
        <PropertyDetailsContent />
      </React.Suspense>
      <Footer />
    </div>
  );
}
