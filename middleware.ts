import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that don't require authentication
const publicPaths = ['/login', '/sign-up', '/forgot-password', '/reset-password', '/terms-of-service', '/privacy-policy', '/email-verified'];

const authPaths = ['/login', '/sign-up']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes and Next.js internals
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }
  
  // Check for JWT token
  const jwtToken = request.cookies.get('jwtToken')?.value;
  
  // If user has a token and is trying to access login/register pages, redirect to home
  if (jwtToken && authPaths.some(path => pathname.startsWith(path))) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }
  
  // If no token and trying to access protected route, redirect to login
  if (!jwtToken && !publicPaths.some(path => pathname.startsWith(path))) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};