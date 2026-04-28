'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AiChatAssistant } from '@/components/ai-chat-assistant';
import { interpretSearchQuery } from '@/ai/flows/interpret-search-query-flow';
import type { InterpretSearchQueryOutput } from '@/ai/flows/interpret-search-query-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { searchProperties } from '@/app/actions';
import { PropertyCard } from '@/components/property-card';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [result, setResult] = useState<InterpretSearchQueryOutput | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);
      interpretSearchQuery({ query })
        .then(async (aiResult) => {
          setResult(aiResult);
          const filtered = await searchProperties(aiResult);
          setProperties(filtered);
        })
        .catch(() => setError('Não foi possível processar sua busca. Tente novamente.'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [query]);

  if (!query) {
    return <p className="text-lg">Faça uma busca na página inicial para começar.</p>;
  }

  if (loading) {
    return (
      <div>
        <p className="text-lg mb-4">
          Buscando por: <span className="font-semibold">"{query}"</span>
        </p>
        <p className="mb-2">Analisando sua busca com IA...</p>
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-lg text-destructive">{error}</p>;
  }

  return (
    <div>
      <p className="text-lg mb-4">
        Sua busca por: <span className="font-semibold">"{query}"</span>
      </p>
      <h2 className="text-2xl font-bold mb-4">Entendemos que você procura por:</h2>
      {result?.summary ? (
        <p className="text-xl bg-muted p-4 rounded-lg">{result.summary}</p>
      ) : (
        <p>Não conseguimos interpretar sua busca.</p>
      )}

      <div className="mt-12 border-t pt-8">
        <h3 className="text-2xl font-bold mb-6">Imóveis encontrados:</h3>
        
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <p className="text-xl text-muted-foreground">
              Nenhum imóvel encontrado para os critérios da sua busca. 
              <br /> 
              Tente pesquisar por algo diferente!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


export default function SearchPage() {
  const searchHeroImage = PlaceHolderImages.find((img) => img.id === 'search-hero-background');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center">
            {searchHeroImage && (
                <Image
                    src={searchHeroImage.imageUrl}
                    alt={searchHeroImage.description}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint={searchHeroImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 container mx-auto text-center text-white px-4">
                <h1 className="text-4xl md:text-5xl font-headline font-bold drop-shadow-lg">
                    Resultados da Busca
                </h1>
            </div>
        </section>
        <div className="container mx-auto px-4 py-16 sm:py-24">
            <Suspense fallback={<Skeleton className="h-32 w-full" />}>
            <SearchResults />
            </Suspense>
        </div>
      </main>
      <Footer />
      <AiChatAssistant />
    </div>
  );
}
