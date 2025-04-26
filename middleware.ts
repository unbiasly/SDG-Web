import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that don't require authentication
const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/terms-of-service', '/privacy-policy', '/email-verified'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public paths and API routes
  if (publicPaths.some(path => pathname.startsWith(path)) || pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }
  
  // Check for JWT token
  const jwtToken = request.cookies.get('jwtToken')?.value;
  
  // If no token and trying to access protected route, redirect to login
  if (!jwtToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login/api).*)'],
}; 