import { adminDb } from '@/lib/firebase/admin';
import { notFound } from 'next/navigation';
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
  Armchair
} from 'lucide-react';
import { PropertyGallery } from '@/components/property-gallery';
import { Separator } from '@/components/ui/separator';

export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const doc = await adminDb.collection('properties').doc(id).get();

  if (!doc.exists) {
    notFound();
  }

  const property = { id: doc.id, ...doc.data() } as any;
  const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price || 0);

  const whatsappNumber = "5511999998888"; // Usando o mesmo número do Header por enquanto
  const whatsappMessage = encodeURIComponent(`Olá! Vi o imóvel "${property.title}" no seu site e gostaria de mais informações.`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Coluna da Esquerda: Imagens e Descrição */}
            <div className="lg:col-span-2 space-y-8">
              {/* Galeria de Imagens com Miniaturas */}
              <PropertyGallery images={property.images} title={property.title} />

              {/* Informações Básicas */}
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

              {/* Características */}
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

              {/* Descrição */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Descrição do Imóvel</h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
                  {property.description}
                </div>
              </div>

              {/* Detalhes Adicionais */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Detalhes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <PawPrint className={cn("h-5 w-5", property.petFriendly ? "text-primary" : "text-muted-foreground")} />
                    <span>{property.petFriendly ? "Aceita Pets" : "Não aceita pets"}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Armchair className={cn("h-5 w-5", property.furnished ? "text-primary" : "text-muted-foreground")} />
                    <span>{property.furnished ? "Mobiliado" : "Sem mobília"}</span>
                  </div>
                  {property.suites > 0 && (
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <BedDouble className="h-5 w-5 text-primary" />
                      <span>{property.suites} Suítes</span>
                    </div>
                  )}
                  {property.propertyType === 'apartamento' && property.floor && (
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Building className="h-5 w-5 text-primary" />
                      <span>{property.floor}º Andar</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Coluna da Direita: Card de Preço e Contato */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 p-6 border rounded-2xl shadow-xl bg-card space-y-6">
                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium uppercase text-xs tracking-wider">Valor do Investimento</span>
                  <div className="text-3xl font-bold text-primary">{formattedPrice}</div>
                  {property.transactionType?.toLowerCase() === 'aluguel' && <span className="text-sm text-muted-foreground">/ mês</span>}
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20" size="lg">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageSquare className="mr-2 h-6 w-6" />
                      TENHO INTERESSE
                    </a>
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Ao clicar, você será redirecionado para o WhatsApp do corretor.
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-bold">Por que este imóvel?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>Localização privilegiada e segura</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>Imóvel verificado e pronto para morar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>Negociação direta e transparente</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
