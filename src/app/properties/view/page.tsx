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
  Check,
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

  const formattedPrice = new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    maximumFractionDigits: 0 
  }).format(property.price || 0);

  const whatsappNumber = "5511919572716";
  const whatsappMessage = encodeURIComponent(`Olá! Vi o imóvel "${property.title}" no seu site e gostaria de mais informações.`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <main className="flex-grow pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Lado Esquerdo: Galeria e Detalhes (Col 8) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-3xl overflow-hidden shadow-sm">
                <PropertyGallery images={property.images} title={property.title} />
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary border-none text-xs uppercase tracking-wider px-3 py-1">
                  {property.transactionType?.toLowerCase() === 'venda' ? 'Venda' : 'Aluguel'}
                </Badge>
                <Badge variant="outline" className="text-xs uppercase tracking-wider px-3 py-1 border-primary/20">
                  {property.propertyType}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">{property.title}</h1>
              
              <div className="flex items-center text-muted-foreground/80">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-lg">{property.address}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary/70">
                        <BedDouble size={18} />
                        <span className="text-sm font-medium">Quartos</span>
                    </div>
                    <span className="text-xl font-bold">{property.beds || 0}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary/70">
                        <Bath size={18} />
                        <span className="text-sm font-medium">Suítes</span>
                    </div>
                    <span className="text-xl font-bold">{property.suites || property.baths || 0}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary/70">
                        <CarFront size={18} />
                        <span className="text-sm font-medium">Vagas</span>
                    </div>
                    <span className="text-xl font-bold">{property.parkingSpaces || 0}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary/70">
                        <Ruler size={18} />
                        <span className="text-sm font-medium">Área</span>
                    </div>
                    <span className="text-xl font-bold">{property.sqft || 0}m²</span>
                </div>
              </div>

              <Separator className="bg-primary/10" />
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-primary">Descrição</h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
                  {property.description}
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito: Card de Ação (Col 4) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#efebe1] rounded-[40px] p-8 md:p-10 shadow-sm border border-black/5 space-y-8">
              
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">Valor do Investimento</span>
                <div className="text-3xl md:text-4xl font-bold text-primary">{formattedPrice}</div>
              </div>

              <div className="space-y-4">
                <Button 
                    asChild 
                    className="w-full h-16 text-sm font-bold tracking-widest bg-[#4a5d4a] hover:bg-[#3d4d3d] text-white rounded-2xl shadow-lg transition-all active:scale-[0.98]" 
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                    <MessageSquare size={20} />
                    TENHO INTERESSE
                  </a>
                </Button>
                <p className="text-[10px] text-center text-primary/40">
                    Ao clicar, você será redirecionado para o WhatsApp do corretor.
                </p>
              </div>

              <div className="space-y-5 pt-4">
                <h3 className="text-sm font-bold text-primary">Por que este imóvel?</h3>
                <ul className="space-y-4">
                  {[
                    "Localização privilegiada e segura",
                    "Imóvel verificado e pronto para morar",
                    "Negociação direta e transparente"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                        <div className="mt-1 bg-primary/10 rounded-full p-0.5 group-hover:bg-primary/20 transition-colors">
                            <Check size={12} className="text-primary" />
                        </div>
                        <span className="text-sm text-primary/70 leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function PropertyDetailsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f1e6]">
      <Header />
      <React.Suspense fallback={
        <div className="flex-grow flex items-center justify-center pt-24 bg-[#f5f1e6]">
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
        </div>
      }>
        <PropertyDetailsContent />
      </React.Suspense>
      <Footer />
    </div>
  );
}
