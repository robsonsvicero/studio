import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');

  // se está tentando acessar /admin e não está logado
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!session?.value) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // se já está logado e tenta acessar o login
  if (request.nextUrl.pathname.startsWith('/admin/login')) {
    if (session?.value) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
