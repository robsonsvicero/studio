'use client';

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import Link from 'next/link';

// Corrigindo o ícone padrão do Leaflet que quebra no Next.js
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface PropertyMapProps {
  properties: any[];
}

export default function PropertyMap({ properties }: PropertyMapProps) {
  // Centro inicial (São Paulo por padrão, ou média dos imóveis)
  const center: [number, number] = [-23.5505, -46.6333];

  return (
    <div className="h-full w-full">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Array.isArray(properties) && properties.map((property) => {
          const lat = property.lat || (-23.5505 + (Math.random() - 0.5) * 0.1);
          const lng = property.lng || (-46.6333 + (Math.random() - 0.5) * 0.1);
          
          return (
            <Marker 
              key={property.id} 
              position={[lat, lng]} 
              icon={customIcon}
            >
              <Popup className="property-popup">
                <Link href={`/properties/view?id=${property.id}`} className="block w-48 space-y-2">
                  <div className="relative aspect-video rounded overflow-hidden">
                    <Image 
                      src={property.images?.[0] || 'https://placehold.co/600x400'} 
                      alt={property.title} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="font-bold text-primary truncate">{property.title}</div>
                  <div className="text-sm font-semibold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                  </div>
                </Link>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
