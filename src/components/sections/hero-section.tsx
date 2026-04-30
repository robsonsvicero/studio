import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function HeroSection() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <section id="inicio" className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 container mx-auto text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 drop-shadow-lg">
          Encontre o imóvel dos seus sonhos
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 drop-shadow-md">
          Descreva o que você procura: "apartamento perto de metrô com 2 quartos e varanda gourmet"
        </p>
        <Card className="max-w-3xl mx-auto bg-background/80 backdrop-blur-sm border-none">
          <CardContent className="p-4">
            <form action="/search" method="GET" className="flex flex-col md:flex-row gap-3 md:gap-4 items-center">
              <Input
                name="q"
                placeholder="Quero um apartamento perto de uma escola boa, com vista para o parque..."
                className="text-foreground flex-grow"
                autoComplete="off"
              />
              <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90">
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
