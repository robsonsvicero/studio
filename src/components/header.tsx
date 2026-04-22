'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Phone, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navLinks = [
  { href: '#inicio', label: 'Início' },
  { href: '#destaques', label: 'Imóveis' },
  { href: '#quem-somos', label: 'Quem Somos' },
  { href: '#contato', label: 'Contato' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const logoDefault = PlaceHolderImages.find((img) => img.id === 'logo');
  const logoWhite = PlaceHolderImages.find((img) => img.id === 'logo-branco');

  useEffect(() => {
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
      <div className="container mx-auto flex h-20 items-center justify-between">
        <Link href="/">
          {displayLogo && (
            <Image
              src={displayLogo.imageUrl}
              alt="André Barbosa Imóveis Logo"
              width={180}
              height={40}
              data-ai-hint={displayLogo.imageHint}
              priority
            />
          )}
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className={cn("transition-colors", !isScrolled ? 'text-white hover:bg-white/20' : 'text-foreground hover:bg-muted')}>
              <a href="tel:11999998888">
                  <Phone size={20}/>
                  <span className="sr-only">Ligar</span>
              </a>
            </Button>
            <Button
                variant={!isScrolled ? "outline" : "default"}
                className={cn('transition-colors', !isScrolled && 'text-white border-white/80 hover:bg-white hover:text-primary')}
                asChild
              >
               <a href="https://wa.me/5511999998888" target="_blank" rel="noopener noreferrer">
                  <MessageSquare size={18}/>
                  <span className="hidden lg:inline ml-2">CONVERSE COMIGO PELO WHATSAPP</span>
               </a>
             </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn('transition-colors', !isScrolled && 'text-white hover:text-white hover:bg-white/20')}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-none">
              <div className="flex h-full flex-col">
                <div className="flex-grow">
                  <div className="flex flex-col gap-6 p-6">
                    <Link href="/">
                      {logoDefault && (
                        <Image
                          src={logoDefault.imageUrl}
                          alt="André Barbosa Imóveis Logo"
                          width={180}
                          height={40}
                          data-ai-hint={logoDefault.imageHint}
                        />
                      )}
                    </Link>
                    <nav className="flex flex-col gap-4">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="text-lg font-medium text-foreground/80 transition-colors hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
                <div className="border-t p-6 space-y-4">
                    <a href="tel:11999998888" className="flex items-center gap-3 text-foreground/80 hover:text-primary">
                        <Phone size={20}/>
                        <span>(11) 99999-8888</span>
                    </a>
                    <a href="https://wa.me/5511999998888" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground/80 hover:text-primary">
                        <MessageSquare size={20}/>
                        <span>Whatsapp</span>
                    </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
