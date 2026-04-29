'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { geocodeAddress } from '@/lib/geocoding';

type PropertyFormProps = {
  initialData?: any;
  propertyId?: string;
};

export function PropertyForm({ initialData, propertyId }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    price: initialData?.price || '',
    address: initialData?.address || '',
    description: initialData?.description || '',
    beds: initialData?.beds || '',
    baths: initialData?.baths || '',
    sqft: initialData?.sqft || '',
    parkingSpaces: initialData?.parkingSpaces || '',
    suites: initialData?.suites || '',
    propertyType: initialData?.propertyType || 'Apartamento',
    transactionType: initialData?.transactionType || 'Venda',
    petFriendly: initialData?.petFriendly || false,
    floor: initialData?.floor || '',
    furnished: initialData?.furnished || 'Sem mobília',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, petFriendly: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const urls: string[] = [];
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Credenciais do Cloudinary faltando. Verifique o .env.local");
      throw new Error("Cloudinary credentials missing");
    }

    for (const image of images) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (data.secure_url) {
        urls.push(data.secure_url);
      }
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedUrls: string[] = [];
      if (images.length > 0) {
        uploadedUrls = await uploadImages();
      }

      const finalImages = [...existingImages, ...uploadedUrls];

      // Geocodificação automática
      const coords = await geocodeAddress(formData.address);

      const propertyData = {
        ...formData,
        price: Number(formData.price),
        beds: Number(formData.beds),
        baths: Number(formData.baths),
        sqft: Number(formData.sqft),
        parkingSpaces: Number(formData.parkingSpaces),
        suites: Number(formData.suites),
        floor: formData.floor ? Number(formData.floor) : null,
        images: finalImages,
        lat: coords?.lat || null,
        lng: coords?.lng || null,
        updatedAt: serverTimestamp(),
      };

      if (propertyId) {
        await updateDoc(doc(db, 'properties', propertyId), propertyData);
      } else {
        await addDoc(collection(db, 'properties'), {
          ...propertyData,
          createdAt: serverTimestamp(),
        });
      }

      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Ocorreu um erro ao salvar o imóvel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-background p-6 rounded-md border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título do Imóvel</Label>
          <Input id="title" name="title" required value={formData.title} onChange={handleChange} placeholder="Ex: Apartamento de Luxo no Morumbi" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input id="price" name="price" type="number" required value={formData.price} onChange={handleChange} placeholder="500000" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Endereço Completo</Label>
          <Input id="address" name="address" required value={formData.address} onChange={handleChange} placeholder="Rua das Flores, 123 - São Paulo, SP" />
        </div>
        
        <div className="space-y-2">
          <Label>Tipo de Imóvel</Label>
          <Select value={formData.propertyType} onValueChange={(val) => handleSelectChange('propertyType', val)}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Apartamento">Apartamento</SelectItem>
              <SelectItem value="Casa">Casa</SelectItem>
              <SelectItem value="Casa de Condomínio">Casa de Condomínio</SelectItem>
              <SelectItem value="Cobertura">Cobertura</SelectItem>
              <SelectItem value="Terreno">Terreno</SelectItem>
              <SelectItem value="Comercial">Comercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Tipo de Transação</Label>
          <Select value={formData.transactionType} onValueChange={(val) => handleSelectChange('transactionType', val)}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Venda">Venda</SelectItem>
              <SelectItem value="Aluguel">Aluguel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="beds">Quartos</Label>
            <Input id="beds" name="beds" type="number" required value={formData.beds} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="suites">Suítes</Label>
            <Input id="suites" name="suites" type="number" value={formData.suites} onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="baths">Banheiros</Label>
            <Input id="baths" name="baths" type="number" required value={formData.baths} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parkingSpaces">Vagas de Garagem</Label>
            <Input id="parkingSpaces" name="parkingSpaces" type="number" value={formData.parkingSpaces} onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sqft">Área Útil (m²)</Label>
            <Input id="sqft" name="sqft" type="number" required value={formData.sqft} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="floor">Andar</Label>
            <Input id="floor" name="floor" type="number" value={formData.floor} onChange={handleChange} placeholder="Ex: 5" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Mobília</Label>
          <Select value={formData.furnished} onValueChange={(val) => handleSelectChange('furnished', val)}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Sem mobília">Sem mobília</SelectItem>
              <SelectItem value="Semimobiliado">Semimobiliado</SelectItem>
              <SelectItem value="Mobiliado">Mobiliado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 mt-8">
          <Switch id="petFriendly" checked={formData.petFriendly} onCheckedChange={handleSwitchChange} />
          <Label htmlFor="petFriendly">Aceita Pets</Label>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" name="description" rows={5} value={formData.description} onChange={handleChange} placeholder="Descreva os diferenciais do imóvel..." />
        </div>

        <div className="space-y-4 md:col-span-2">
          <Label>Fotos do Imóvel</Label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground"><span className="font-semibold">Clique para fazer upload</span> ou arraste as fotos</p>
              </div>
              <input id="images" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
          
          {images.length > 0 && (
            <p className="text-sm text-muted-foreground">{images.length} novas fotos selecionadas.</p>
          )}

          {existingImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {existingImages.map((url, i) => (
                <div key={i} className="relative aspect-video rounded overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="property" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="button" variant="outline" className="mr-4" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {propertyId ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
        </Button>
      </div>
    </form>
  );
}
