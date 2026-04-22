import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function Footer() {
  const logoImage = PlaceHolderImages.find((img) => img.id === 'logo');

  return (
    <footer id="contato" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">Entre em Contato</h2>
            <p className="text-primary-foreground/80 mb-8">
              Tem alguma dúvida ou deseja agendar uma visita? Preencha o formulário abaixo.
            </p>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-primary-foreground/90">Nome</Label>
                  <Input id="name" placeholder="Seu nome completo" className="bg-background/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-primary-foreground/90">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" className="bg-background/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-primary-foreground/90">Mensagem</Label>
                <Textarea id="message" placeholder="Como posso ajudar?" className="bg-background/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60" />
              </div>
              <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Enviar Mensagem
              </Button>
            </form>
          </div>
          <div className="flex flex-col items-start md:items-end text-left md:text-right">
             <Link href="/" className="mb-4">
               {logoImage && (
                 <Image
                   src={logoImage.imageUrl}
                   alt="André Barbosa Imóveis Logo"
                   width={180}
                   height={40}
                   data-ai-hint={logoImage.imageHint}
                 />
               )}
             </Link>
             <p className="max-w-sm text-primary-foreground/80 mb-4">
              Realizando sonhos e construindo futuros no coração do Brasil.
            </p>
            <p className="font-semibold">Brasília, DF</p>
            <p className="text-primary-foreground/80">(61) 99999-8888</p>
            <p className="text-primary-foreground/80">contato@andrebarbosaimoveis.com</p>
          </div>
        </div>
      </div>
      <div className="bg-primary/90">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-primary-foreground/60">
          &copy; {new Date().getFullYear()} André Barbosa Imóveis. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
