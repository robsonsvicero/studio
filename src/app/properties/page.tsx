'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/header';
import { FilterBar } from '@/components/properties/filter-bar';
import { PropertyCard } from '@/components/property-card';
import { collection, getDocs, orderBy, query, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { getApiUrl } from '@/lib/api-utils';

// Importação dinâmica do Mapa para evitar erros de SSR do Leaflet
const PropertyMap = dynamic(
  () => import('@/components/properties/property-map'),
  { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
  }
);

function PropertiesListContent() {
  const [properties, setProperties] = React.useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch(getApiUrl('/api/properties'));
        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const handleFilterChange = (filters: any) => {
    let filtered = [...properties];

    // Filtro Tipo
    if (filters.type !== 'Todos') {
      filtered = filtered.filter(p => p.propertyType === filters.type);
    }

    // Filtro Quartos
    if (filters.beds !== 'Qualquer') {
      const minBeds = parseInt(filters.beds);
      filtered = filtered.filter(p => (p.beds || 0) >= minBeds);
    }

    // Filtro Vagas
    if (filters.parking !== 'Qualquer') {
      const minParking = parseInt(filters.parking);
      filtered = filtered.filter(p => (p.parkingSpaces || 0) >= minParking);
    }

    // Filtro Suítes
    if (filters.suites !== 'Qualquer') {
      const minSuites = parseInt(filters.suites);
      filtered = filtered.filter(p => (p.suites || 0) >= minSuites);
    }

    // Filtro Pet Friendly
    if (filters.petFriendly) {
      filtered = filtered.filter(p => p.petFriendly === true);
    }

    // Filtro Mobiliado
    if (filters.furnished) {
      filtered = filtered.filter(p => p.furnished === true);
    }

    // Filtro Preço
    filtered = filtered.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    setFilteredProperties(filtered);
  };

  return (
    <>
      {/* Barra de Filtros no Topo */}
      <div className="pt-20">
        <FilterBar onFilterChange={handleFilterChange} />
      </div>

      <main className="flex flex-grow overflow-hidden">
        
        {/* Lado Esquerdo: Lista de Imóveis */}
        <div className="w-full lg:w-[60%] xl:w-[55%] overflow-y-auto h-[calc(100vh-140px)] bg-background">
          <div className="p-4 md:p-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-2xl font-bold">Imóveis em São Paulo</h1>
                <p className="text-muted-foreground">{filteredProperties.length} imóveis encontrados</p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
                <p className="text-xl text-muted-foreground">Nenhum imóvel encontrado com esses filtros.</p>
              </div>
            )}
          </div>
        </div>

        {/* Lado Direito: Mapa (Oculto em Mobile) */}
        <div className="hidden lg:block lg:flex-grow h-[calc(100vh-140px)] border-l">
          <PropertyMap properties={filteredProperties} />
        </div>
      </main>
    </>
  );
}

export default function PropertiesListPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <React.Suspense fallback={
        <div className="pt-24 flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      }>
        <PropertiesListContent />
      </React.Suspense>
    </div>
  );
}
