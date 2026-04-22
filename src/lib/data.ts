import { PlaceHolderImages } from './placeholder-images';

export type Property = {
  id: string;
  title: string;
  price: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  imageHint: string;
};

const propertyImages = PlaceHolderImages.filter(img => img.id.startsWith('property-'));

export const properties: Property[] = [
  {
    id: '1',
    title: 'Casa Moderna no Morumbi',
    price: 'R$ 3.500.000',
    address: 'Morumbi, São Paulo, SP',
    beds: 4,
    baths: 5,
    sqft: 450,
    image: propertyImages[0].imageUrl,
    imageHint: propertyImages[0].imageHint,
  },
  {
    id: '2',
    title: 'Apartamento de Luxo em Higienópolis',
    price: 'R$ 2.800.000',
    address: 'Higienópolis, São Paulo, SP',
    beds: 3,
    baths: 3,
    sqft: 180,
    image: propertyImages[1].imageUrl,
    imageHint: propertyImages[1].imageHint,
  },
  {
    id: '3',
    title: 'Casa de Campo em Cotia',
    price: 'R$ 1.200.000',
    address: 'Cotia, São Paulo, SP',
    beds: 3,
    baths: 2,
    sqft: 250,
    image: propertyImages[2].imageUrl,
    imageHint: propertyImages[2].imageHint,
  },
  {
    id: '4',
    title: 'Cobertura com Vista para a Cidade',
    price: 'R$ 4.800.000',
    address: 'Itaim Bibi, São Paulo, SP',
    beds: 4,
    baths: 4,
    sqft: 320,
    image: propertyImages[3].imageUrl,
    imageHint: propertyImages[3].imageHint,
  },
  {
    id: '5',
    title: 'Loft Industrial na Vila Madalena',
    price: 'R$ 950.000',
    address: 'Vila Madalena, São Paulo, SP',
    beds: 1,
    baths: 2,
    sqft: 90,
    image: propertyImages[4].imageUrl,
    imageHint: propertyImages[4].imageHint,
  },
  {
    id: '6',
    title: 'Residência Familiar na Granja Viana',
    price: 'R$ 2.900.000',
    address: 'Granja Viana, Cotia, SP',
    beds: 5,
    baths: 6,
    sqft: 600,
    image: propertyImages[5].imageUrl,
    imageHint: propertyImages[5].imageHint,
  },
];
