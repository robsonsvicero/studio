'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

const initialState = {
  response: null,
  summary: null,
  errors: null,
  submitted: false,
};

import { getApiUrl } from '@/lib/api-utils';

export function Footer() {
  const logoImage = PlaceHolderImages.find((img) => img.id === 'logo-branco');
  const [state, setState] = React.useState(initialState);
  const [loading, setLoading] = React.useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(getApiUrl('/api/contact'), {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      setState(result);
      
      if (result.submitted) {
        formRef.current?.reset();
      }
    } catch (err) {
      console.error(err);
      setState({ ...initialState, response: 'Erro ao enviar mensagem. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer id="contato" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">Entre em Contato</h2>
            <p className="text-primary-foreground/80 mb-8">
              Tem alguma dúvida ou deseja agendar uma visita? Preencha o formulário abaixo.
            </p>
            {state.submitted && state.response ? (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-md space-y-3">
                    <h3 className="font-bold">Mensagem Enviada!</h3>
                    <p>{state.response}</p>
                </div>
            ) : (
                <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-primary-foreground/90">Nome</Label>
                      <Input id="name" name="name" placeholder="Seu nome completo" required className="bg-background/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60" />
                      {state.errors?.name && <p className="text-sm text-accent">{state.errors.name[0]}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-primary-foreground/90">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="seu@email.com" required className="bg-background/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60" />
                      {state.errors?.email && <p className="text-sm text-accent">{state.errors.email[0]}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-primary-foreground/90">Mensagem</Label>
                    <Textarea id="message" name="message" placeholder="Como posso ajudar? Ex: Busco apartamento de 3 quartos no Itaim Bibi." required className="bg-background/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60" />
                    {state.errors?.message && <p className="text-sm text-accent">{state.errors.message[0]}</p>}
                  </div>
                  <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                    Enviar Mensagem
                  </Button>
                  {!state.submitted && state.response && (
                    <p className="text-sm text-accent">{state.response}</p>
                  )}
                </form>
            )}
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
              Realizando sonhos e construindo futuros na maior metrópole do país.
            </p>
            <p className="font-semibold">São Paulo, SP</p>
            <p className="text-primary-foreground/80">(11) 99999-8888</p>
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
