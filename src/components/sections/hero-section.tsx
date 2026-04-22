import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md">
          Consultoria imobiliária de excelência para encontrar o lugar perfeito para você.
        </p>
        <Card className="max-w-3xl mx-auto bg-background/80 backdrop-blur-sm border-none">
          <CardContent className="p-4">
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Select>
                <SelectTrigger className="text-foreground">
                  <SelectValue placeholder="Tipo de imóvel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="cobertura">Cobertura</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="text-foreground">
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brasilia">Brasília</SelectItem>
                  <SelectItem value="aguas-claras">Águas Claras</SelectItem>
                  <SelectItem value="guara">Guará</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="text-foreground">
                  <SelectValue placeholder="Faixa de preço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500k">Até R$500.000</SelectItem>
                  <SelectItem value="1m">R$500.001 a R$1.000.000</SelectItem>
                  <SelectItem value="2m">R$1.000.001 a R$2.000.000</SelectItem>
                  <SelectItem value="plus">Acima de R$2.000.000</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
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
