'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Phone, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/properties', label: 'Imóveis' },
  { href: '#quem-somos', label: 'Quem Somos' },
  { href: '#contato', label: 'Contato' },
  { href: '/admin/login', label: 'Área do Corretor' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const logoDefault = PlaceHolderImages.find((img) => img.id === 'logo');
  const logoWhite = PlaceHolderImages.find((img) => img.id === 'logo-branco');

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const displayLogo = !isScrolled ? logoWhite : logoDefault;

  return (
    <header
      className={cn(
        'top-0 left-0 right-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'fixed bg-background/80 shadow-md backdrop-blur-sm'
          : 'absolute bg-transparent'
      )}
    >
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 h-20 items-center">
        {/* Logo à esquerda */}
        <div className="flex justify-start">
          <Link href="/">
            {displayLogo && (
              <Image
                src={displayLogo.imageUrl}
                alt="André Barbosa Imóveis Logo"
                width={200}
                height={66}
                style={{ height: 'auto', width: 'auto' }}
                data-ai-hint={displayLogo.imageHint}
                className="w-auto h-12 md:h-11"
                priority
              />
            )}
          </Link>
        </div>

        {/* Menu Hamburguer ao centro */}
        <div className="flex justify-center">
          {isMounted && (
            <Sheet>
              <SheetTrigger asChild>
                <button 
                  className={cn(
                    'group flex flex-col items-center justify-center gap-2.5 p-2 transition-all hover:opacity-80',
                    !isScrolled ? 'text-white' : 'text-foreground'
                  )}
                >
                  <span className={cn(
                    "h-1 w-10 rounded-full bg-current transition-all",
                    !isScrolled ? "bg-white" : "bg-primary"
                  )} />
                  <span className={cn(
                    "h-1 w-10 rounded-full bg-current transition-all",
                    !isScrolled ? "bg-white" : "bg-primary"
                  )} />
                  <span className="sr-only">Abrir menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-none">
                <SheetTitle className="sr-only">Menu Principal</SheetTitle>
                <div className="flex h-full flex-col">
                  <div className="flex-grow">
                    <div className="flex flex-col items-center gap-6 p-6 mt-10">
                      <Link href="/">
                        {logoDefault && (
                          <Image
                            src={logoDefault.imageUrl}
                            alt="André Barbosa Imóveis Logo"
                            width={200}
                            height={66}
                            style={{ height: 'auto', width: 'auto' }}
                            data-ai-hint={logoDefault.imageHint}
                            className="w-auto h-12"
                          />
                        )}
                      </Link>
                      <nav className="flex flex-col items-center gap-6 mt-4">
                        {navLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="text-xl font-medium text-foreground/80 transition-colors hover:text-primary text-center"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </div>
                  <div className="border-t p-6 space-y-4 flex flex-col items-center">
                      <a href="tel:11919572716" className="flex items-center gap-3 text-foreground/80 hover:text-primary">
                          <Phone size={20}/>
                          <span>(11) 91957-2716</span>
                      </a>
                      <a href="https://wa.me/5511919572716" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground/80 hover:text-primary">
                          <MessageSquare size={20}/>
                          <span>Whatsapp</span>
                      </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Botão de WhatsApp — visível apenas no desktop */}
        <div className="hidden md:flex justify-end">
          <Button
            variant={!isScrolled ? "outline" : "default"}
            className={cn(
              'transition-all font-medium h-11 px-6',
              !isScrolled && 'bg-primary border-transparent text-primary-foreground hover:bg-primary/90'
            )}
            asChild
          >
            <a href="https://wa.me/5511919572716" target="_blank" rel="noopener noreferrer">
              <MessageSquare className="h-5 w-5 mr-2" />
              WHATSAPP
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
