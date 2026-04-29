/**
 * Geocodifica um endereço usando a API gratuita do Nominatim (OpenStreetMap).
 * @param address O endereço completo do imóvel.
 * @returns Um objeto com latitude e longitude ou null se não encontrado.
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    console.log('Geocodificando endereço:', address);
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        headers: {
          'User-Agent': 'StudioRealEstate/1.0',
        },
      }
    );

    const data = await response.json();
    console.log('Resultado da geocodificação:', data);

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }

    console.warn('Endereço não encontrado no Nominatim.');
    return null;
  } catch (error) {
    console.error('Erro na geocodificação:', error);
    return null;
  }
}
