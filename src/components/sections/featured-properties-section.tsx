import { PropertyCard } from '@/components/property-card';
import { properties } from '@/lib/data';

export function FeaturedPropertiesSection() {
  return (
    <section id="destaques" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Imóveis em Destaque</h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Uma seleção especial de imóveis que combinam luxo, conforto e excelente localização.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
