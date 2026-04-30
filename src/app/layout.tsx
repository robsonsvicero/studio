import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: {
    default: 'André Barbosa Imóveis | Luxo e Sofisticação em São Paulo',
    template: '%s | André Barbosa Imóveis'
  },
  description: 'Consultoria imobiliária personalizada em São Paulo. Especialista em imóveis de alto padrão, casas e apartamentos de luxo para quem busca exclusividade.',
  keywords: ['imóveis de luxo', 'apartamento alto padrão', 'são paulo imobiliária', 'andre barbosa imóveis', 'casas de luxo sp', 'investimento imobiliário'],
  authors: [{ name: 'André Barbosa' }],
  creator: 'André Barbosa',
  publisher: 'André Barbosa Imóveis',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://andrebarbosaimoveis.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'André Barbosa Imóveis | Encontre seu refúgio em São Paulo',
    description: 'Consultoria imobiliária de alto padrão. O imóvel perfeito para o seu estilo de vida está aqui.',
    url: 'https://andrebarbosaimoveis.com.br',
    siteName: 'André Barbosa Imóveis',
    images: [
      {
        url: '/assets/seo-image.png',
        width: 1200,
        height: 630,
        alt: 'André Barbosa Imóveis - Luxo e Sofisticação',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'André Barbosa Imóveis | Alto Padrão em São Paulo',
    description: 'Onde luxo e exclusividade se encontram. Conheça nossos imóveis selecionados.',
    images: ['/assets/seo-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
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
