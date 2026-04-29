import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Bath, Ruler, MapPin, CarFront } from 'lucide-react';

export function PropertyCard({ property }: { property: any }) {
  const imageUrl = property.images && property.images.length > 0 ? property.images[0] : property.image;
  const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price || 0);

  return (
    <Link href={`/properties/view?id=${property.id}`} className="block h-full transition-transform duration-300 hover:-translate-y-2">
      <Card className="h-full overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl flex flex-col cursor-pointer">
        <CardHeader className="p-0 relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={property.title}
              width={600}
              height={400}
              style={{ height: 'auto' }}
              className="object-cover w-full h-48"
            />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">Sem foto</div>
          )}
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">{formattedPrice}</Badge>
          {property.transactionType && (
            <Badge className="absolute top-2 left-2" variant="secondary">{property.transactionType}</Badge>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-medium mb-1 group-hover:text-primary transition-colors">{property.title}</CardTitle>
          <div className="flex items-center text-muted-foreground text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{property.address}</span>
          </div>
          {property.propertyType && (
            <Badge variant="outline" className="text-xs">{property.propertyType}</Badge>
          )}
        </CardContent>
        <CardFooter className="p-4 bg-muted/50 grid grid-cols-4 gap-2 text-xs">
          <div className="flex flex-col items-center gap-1">
            <BedDouble className="h-4 w-4 text-primary" />
            <span>{property.beds || 0}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bath className="h-4 w-4 text-primary" />
            <span>{property.baths || 0}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CarFront className="h-4 w-4 text-primary" />
            <span>{property.parkingSpaces || 0}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Ruler className="h-4 w-4 text-primary" />
            <span>{property.sqft || 0}m²</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
