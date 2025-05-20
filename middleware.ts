import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that don't require authentication
const publicPaths = [
  '/login', 
  '/sign-up', 
  '/forgot-password', 
  '/reset-password', 
  '/terms-of-service', 
  '/privacy-policy', 
  '/email-verified',
  '/post/*',  // Allow access to post listing
  '/video/*'       // Alternative path for posts
];

// Paths that should redirect to home if already logged in
const authPaths = ['/login', '/sign-up', '/reset-password' ]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Modify this condition to ensure proper CORS headers are applied
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    const response = NextResponse.next();
    // Add CORS headers for API routes to improve debuggability
    if (pathname.startsWith('/api/') && process.env.NODE_ENV === 'development') {
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    return response;
  }
  
  // Check for Session Id
  const sessionId = request.cookies.get('sessionId')?.value;
  
  // If user has a token and is trying to access login/register pages, redirect to home
  if (sessionId && authPaths.some(path => pathname.startsWith(path))) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }
  
  // If no token and trying to access protected route, redirect to login
  // Check for public paths OR post-specific paths (which start with /app/posts/ or /posts/ and likely contain an ID)
  if (!sessionId && 
      !publicPaths.some(path => pathname.startsWith(path)) &&
      !pathname.match(/^\/app\/posts\/[^\/]+$/) &&   // Pattern for /app/posts/{id}
      !pathname.match(/^\/posts\/[^\/]+$/)) {        // Pattern for /posts/{id}
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};