import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  // Define as origens permitidas
  const allowedOrigins = [
    'https://andrebarbosaimoveis.com.br',
    'https://www.andrebarbosaimoveis.com.br',
    'http://localhost:3000'
  ];

  const origin = request.headers.get('origin');

  // Verifica se a origem da requisição está na nossa lista de permissões
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  // Se for uma requisição de preflight (OPTIONS)
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Max-Age', '86400');
    }
    
    return response;
  }

  // Para as requisições normais (GET, POST, etc.)
  const response = NextResponse.next();
  
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}

// Aplica o middleware apenas para as rotas de API
export const config = {
  matcher: '/api/:path*',
};
