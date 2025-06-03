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
];

// Paths that should redirect to home if already logged in
const authPaths = ['/login', '/sign-up', '/reset-password'];

// Protected paths that require authentication
const protectedPaths = [
  '/',
  '/bookmarks',
  '/profile',
  '/settings',
  '/jobs',
  '/scheme',
  '/notifications',
  '/goals',
  '/society',
  '/mentorship',
  '/internship',
  '/search',
];

// Patterns for dynamic routes that require authentication
const protectedPatterns = [
  /^\/post\/[^\/]+$/,
  /^\/posts\/[^\/]+$/,
  /^\/videos\/[^\/]+$/,
  /^\/profile\/[^\/]+$/,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes and Next.js internal routes
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    const response = NextResponse.next();
    // Add CORS headers for API routes in development
    if (pathname.startsWith('/api/') && process.env.NODE_ENV === 'development') {
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    return response;
  }

  // Get session data from cookies
  const sessionId = request.cookies.get('sessionId')?.value;
  const jwtToken = request.cookies.get('jwtToken')?.value;
  
  console.log('Middleware check - SessionId:', !!sessionId, 'JwtToken:', !!jwtToken, 'Path:', pathname);

  // Helper function to create no-cache response with stronger headers
  const createNoCacheResponse = (response: NextResponse) => {
    // Stronger cache prevention for production
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    response.headers.set('Vary', 'Cookie, Authorization');
    
    // Add timestamp to prevent caching
    response.headers.set('X-Timestamp', Date.now().toString());
    return response;
  };

  // Helper function to redirect to login with session clearing
  const redirectToLogin = () => {
    const loginUrl = new URL('/login', request.url);
    // Add a timestamp to bust any potential caching
    loginUrl.searchParams.set('t', Date.now().toString());
    const response = NextResponse.redirect(loginUrl);
    
    // Clear all authentication cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as 'lax',
      maxAge: 0,
      path: '/'
    };
    
    response.cookies.set('sessionId', '', cookieOptions);
    response.cookies.set('jwtToken', '', cookieOptions);
    response.cookies.set('refreshToken', '', cookieOptions);
    response.cookies.set('userId', '', cookieOptions);
    
    return createNoCacheResponse(response);
  };

  // Check if user has valid session (both sessionId and jwtToken required)
  const hasValidSession = sessionId && jwtToken;

  // If user has valid session but trying to access auth pages, redirect to home
  if (hasValidSession && authPaths.some(path => pathname.startsWith(path))) {
    const homeUrl = new URL('/', request.url);
    homeUrl.searchParams.set('t', Date.now().toString());
    const response = NextResponse.redirect(homeUrl);
    return createNoCacheResponse(response);
  }

  // Check if the current path requires authentication
  const isProtectedPath = 
    protectedPaths.includes(pathname) ||
    protectedPaths.some(path => pathname.startsWith(path + '/')) ||
    protectedPatterns.some(pattern => pattern.test(pathname));

  // Check if it's a public path
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // REINFORCED SESSION VALIDATION
  // If no valid session and trying to access protected content
  if (!hasValidSession && (isProtectedPath || (!isPublicPath && !pathname.startsWith('/api/')))) {
    console.log('No valid session detected, redirecting to login. Path:', pathname);
    return redirectToLogin();
  }

  // Additional check: If sessionId exists but jwtToken is missing (partial logout scenario)
  if (sessionId && !jwtToken && !isPublicPath) {
    console.log('Partial session detected (sessionId without jwtToken), clearing and redirecting');
    return redirectToLogin();
  }

  // Additional check: If jwtToken exists but sessionId is missing (corrupted state)
  if (jwtToken && !sessionId && !isPublicPath) {
    console.log('Corrupted session detected (jwtToken without sessionId), clearing and redirecting');
    return redirectToLogin();
  }

  // For protected paths, always add no-cache headers
  if (isProtectedPath || hasValidSession) {
    const response = NextResponse.next();
    return createNoCacheResponse(response);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure middleware to run on all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};