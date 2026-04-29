/**
 * Retorna a URL base da API. 
 * Em produção (Hostinger), usa a URL da Vercel configurada no .env.
 * Em desenvolvimento, usa a URL local.
 */
export function getApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  // Se for uma URL relativa e estivermos no navegador
  if (!baseUrl && typeof window !== 'undefined') {
    return path;
  }

  // Remove barras duplicadas
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
  
  return `${cleanBase}/${cleanPath}`;
}
