'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AiChatAssistant } from '@/components/ai-chat-assistant';
import { interpretSearchQuery } from '@/ai/flows/interpret-search-query-flow';
import type { InterpretSearchQueryOutput } from '@/ai/flows/interpret-search-query-flow';
import { Skeleton } from '@/components/ui/skeleton';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [result, setResult] = useState<InterpretSearchQueryOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);
      interpretSearchQuery({ query })
        .then(setResult)
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

      <div className="mt-8 border-t pt-8">
        <h3 className="text-xl font-bold mb-4">Resultados da Busca (Demonstração)</h3>
        <p className="text-muted-foreground">
          (Em breve, os imóveis correspondentes à sua busca aparecerão aqui.)
        </p>
      </div>
    </div>
  );
}


export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24 sm:py-32">
        <h1 className="text-3xl font-bold mb-8">Resultados da Busca</h1>
        <Suspense fallback={<Skeleton className="h-32 w-full" />}>
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
      <AiChatAssistant />
    </div>
  );
}
