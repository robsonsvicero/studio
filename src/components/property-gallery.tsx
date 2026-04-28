'use client';

import * as React from "react";
import Image from "next/image";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const onThumbnailClick = (index: number) => {
    if (!api) return;
    api.scrollTo(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-video flex items-center justify-center bg-muted rounded-xl text-muted-foreground">
        Sem fotos disponíveis
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Imagem Principal */}
      <div className="relative rounded-xl overflow-hidden bg-muted aspect-video shadow-lg">
        <Carousel setApi={setApi} className="w-full h-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="relative aspect-video">
                <Image
                  src={image}
                  alt={`${title} - Foto ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/40 border-none text-white transition-all backdrop-blur-sm" />
              <CarouselNext className="right-4 bg-white/20 hover:bg-white/40 border-none text-white transition-all backdrop-blur-sm" />
            </>
          )}
        </Carousel>
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onThumbnailClick(index)}
              className={cn(
                "relative flex-shrink-0 w-24 aspect-video rounded-lg overflow-hidden border-2 transition-all",
                current === index ? "border-primary ring-2 ring-primary/20 scale-105" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
