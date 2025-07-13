import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from './authMiddleware';

const PUBLIC_PATHS = ['/login', '/register', '/api/auth/login', '/api/auth/register'];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(path => pathname.startsWith(path));
}

function createLoginRedirect(request: NextRequest): NextResponse {
  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  const authResult = await authenticateToken(request);
  
  if ('error' in authResult) {
    return createLoginRedirect(request);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};