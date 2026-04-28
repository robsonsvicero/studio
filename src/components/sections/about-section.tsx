import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

export function AboutSection() {
  const consultantImage = PlaceHolderImages.find((img) => img.id === 'consultant-portrait');
  
  return (
    <section id="quem-somos" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square w-full max-w-md mx-auto">
            {consultantImage && (
              <Image
                src={consultantImage.imageUrl}
                alt={consultantImage.description}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="rounded-lg object-cover shadow-2xl"
                priority
                data-ai-hint={consultantImage.imageHint}
              />
            )}
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-4">
              André Barbosa
            </h2>
            <p className="text-accent font-semibold text-lg mb-6">Consultor Imobiliário</p>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Com mais de 15 anos de experiência no mercado de alto padrão de São Paulo, meu compromisso é com a excelência e a satisfação do cliente. Acredito que encontrar um imóvel é mais do que uma transação; é a realização de um sonho.
              </p>
              <p>
                Minha abordagem é pautada na transparência, ética e um profundo conhecimento do mercado local. Estou aqui para guiar você em cada passo do processo, garantindo uma experiência segura, tranquila e bem-sucedida.
              </p>
              <p>
                Vamos juntos encontrar o imóvel que reflete seu estilo de vida e suas aspirações.
              </p>
            </div>
            <Button size="lg" className="mt-8 bg-primary hover:bg-primary/90">
              Saiba Mais
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
