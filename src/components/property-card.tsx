import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Property } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Bath, Ruler, MapPin } from 'lucide-react';

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col">
      <CardHeader className="p-0 relative">
        <Image
          src={property.image}
          alt={property.title}
          width={600}
          height={400}
          className="object-cover w-full h-48"
          data-ai-hint={property.imageHint}
        />
        <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">{property.price}</Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-medium mb-1">{property.title}</CardTitle>
        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{property.address}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <BedDouble className="h-5 w-5 text-primary" />
          <span>{property.beds} {property.beds > 1 ? 'quartos' : 'quarto'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Bath className="h-5 w-5 text-primary" />
          <span>{property.baths} {property.baths > 1 ? 'banhs.' : 'banh.'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Ruler className="h-5 w-5 text-primary" />
          <span>{property.sqft} m²</span>
        </div>
      </CardFooter>
    </Card>
  );
}
