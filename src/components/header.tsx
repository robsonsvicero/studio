'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
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
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-background/80 shadow-md backdrop-blur-sm' : 'bg-transparent'
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

        <div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn(!isScrolled && 'text-white hover:text-white hover:bg-white/20')}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
