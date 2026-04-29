/**
 * Retorna a URL base da API. 
 * Em produção (Hostinger), usa a URL da Vercel configurada no .env.
 * Em desenvolvimento, usa a URL local.
 */
export function getApiUrl(path: string): string {
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  // Em desenvolvimento ou se a URL base não estiver configurada, usa caminhos relativos
  if (isDevelopment || !baseUrl) {
    return path;
  }

  // Remove barras duplicadas para URLs absolutas
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
  
  return `${cleanBase}/${cleanPath}`;
}
