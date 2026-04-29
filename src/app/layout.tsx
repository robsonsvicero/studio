import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'André Barbosa Imóveis',
  description: 'Encontre o imóvel dos seus sonhos com a consultoria de André Barbosa.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')} suppressHydrationWarning>
        {process.env.NODE_ENV === 'development' && (
          <style dangerouslySetInnerHTML={{ __html: `
            [data-next-badge-root], #devtools-indicator, nextjs-portal { 
              display: none !important; 
              visibility: hidden !important; 
            }
          `}} />
        )}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
