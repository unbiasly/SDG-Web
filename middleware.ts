import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that don't require authentication
const publicPaths = [
    "/login",
    "/onboarding",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/terms-of-service",
    "/privacy-policy",
    "/email-verified",
];

// Paths that should redirect to home if already logged in
const authPaths = ["/login", "/sign-up", "/reset-password"];

// Protected paths that require authentication
const protectedPaths = [
    "/",
    "/bookmarks",
    "/profile",
    "/settings",
    "/jobs",
    "/scheme",
    "/notifications",
    "/goals",
    "/society",
    "/mentorship",
    "/internship",
    "/search",
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
    if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
        const response = NextResponse.next();
        // Add CORS headers for API routes in development
        if (
            pathname.startsWith("/api/") &&
            process.env.NODE_ENV === "development"
        ) {
            response.headers.set("Access-Control-Allow-Origin", "*");
            response.headers.set(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS"
            );
            response.headers.set(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization"
            );
        }
        return response;
    }

    // Get session data from cookies
    const sessionId = request.cookies.get("sessionId")?.value;
    const jwtToken = request.cookies.get("jwtToken")?.value;
    const userId = request.cookies.get("userId")?.value;

    // Get referer to check where the request is coming from
    const referer = request.headers.get("referer");

    // Helper function to create no-cache response with stronger headers
    const createNoCacheResponse = (response: NextResponse) => {
        // Stronger cache prevention for production
        response.headers.set(
            "Cache-Control",
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0"
        );
        response.headers.set("Pragma", "no-cache");
        response.headers.set("Expires", "0");
        response.headers.set("Surrogate-Control", "no-store");
        response.headers.set("Vary", "Cookie, Authorization");

        // Add timestamp to prevent caching
        response.headers.set("X-Timestamp", Date.now().toString());
        return response;
    };

    // Helper function to redirect to login with session clearing
    const redirectToLogin = () => {
        const loginUrl = new URL("/login", request.url);
        // Add a timestamp to bust any potential caching
        loginUrl.searchParams.set("t", Date.now().toString());
        const response = NextResponse.redirect(loginUrl);

        // Clear all authentication cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as "lax",
            maxAge: 0,
            path: "/",
        };

        response.cookies.set("sessionId", "", cookieOptions);
        response.cookies.set("jwtToken", "", cookieOptions);
        response.cookies.set("refreshToken", "", cookieOptions);
        response.cookies.set("userId", "", cookieOptions);

        return createNoCacheResponse(response);
    };

    // Helper function to redirect to home with no-cache headers
    const redirectToHome = () => {
        const homeUrl = new URL("/", request.url);
        // Add a timestamp to bust any potential caching
        homeUrl.searchParams.set("t", Date.now().toString());
        const response = NextResponse.redirect(homeUrl);
        return createNoCacheResponse(response);
    };

    // Helper function to check if referer is from allowed auth pages
    const isFromAllowedAuthPage = (referer: string | null): boolean => {
        if (!referer) return false;

        try {
            const refererUrl = new URL(referer);
            const refererPathname = refererUrl.pathname;

            // Check if coming from login or sign-up pages
            return (
                refererPathname === "/login" || refererPathname === "/sign-up"
            );
        } catch {
            return false;
        }
    };

    // Check if user is logged in (requires both sessionId and jwtToken for secure authentication)
    const isLoggedIn = Boolean(sessionId && jwtToken);
    
    // Check if user has valid session (both sessionId and jwtToken required for full authentication)
    const hasValidSession = Boolean(sessionId && jwtToken);

    // PRIORITY CHECK: Prevent logged-in users from accessing login page
    // This check happens BEFORE all other checks to prevent any navigation to login
    if (isLoggedIn && pathname === "/login") {
        if (process.env.NODE_ENV === "development") {
            console.log(
                "Logged-in user attempting to access login page. SessionId:",
                !!sessionId,
                "UserId:",
                !!userId,
                "Redirecting to home."
            );
        }
        return redirectToHome();
    }

    // PRIORITY CHECK: Prevent logged-in users from accessing auth pages
    if (isLoggedIn && authPaths.includes(pathname)) {
        const hasCompletedOnboarding = Boolean(request.cookies.get("role_type")?.value);
        
        // Special case: Allow access to sign-up if onboarding is incomplete
        const shouldAllowAccess = !hasCompletedOnboarding && pathname === "/sign-up";
        
        if (!shouldAllowAccess) {
            if (process.env.NODE_ENV === "development") {
                console.log(
                    "Logged-in user attempting to access auth page:",
                    pathname,
                    "Redirecting to home."
                );
            }
            return redirectToHome();
        }
    }
    // Special handling for /onboarding route
    if (pathname.startsWith("/onboarding")) {
        // Check if user has completed onboarding
        const hasCompletedOnboarding = Boolean(request.cookies.get(
            "role_type"
        )?.value);

        // If user has completed onboarding, redirect to home
        if (hasValidSession && hasCompletedOnboarding) {
            const homeUrl = new URL("/", request.url);
            const response = NextResponse.redirect(homeUrl);
            return createNoCacheResponse(response);
        }

        // If user has valid session OR coming from auth pages, allow onboarding access
        if (hasValidSession || isFromAllowedAuthPage(referer)) {
            const response = NextResponse.next();
            return createNoCacheResponse(response);
        }

        // Block access if no valid session and not coming from auth pages
        if (process.env.NODE_ENV === "development") {
            console.log(
                "Unauthorized onboarding access attempt. Referer:",
                referer
            );
        }
        return redirectToLogin();
    }

    // Check if the current path requires authentication
    const isProtectedPath =
        protectedPaths.includes(pathname) ||
        protectedPaths.some((path) =>
            new RegExp(`^${path}(?:/|$)`).test(pathname)
        ) ||
        protectedPatterns.some((pattern) => pattern.test(pathname));

    // Check if it's a public path
    const isPublicPath = publicPaths.some((path) => pathname === path);

    // If no valid session and trying to access protected or non-public path, redirect to login
    if (
        !hasValidSession &&
        (isProtectedPath || (!isPublicPath && !pathname.startsWith("/api/")))
    ) {
        if (process.env.NODE_ENV === "development") {
            console.log(
                "No valid session detected, redirecting to login. Path:",
                pathname
            );
        }
        return redirectToLogin();
    }

    // Handle partial session: sessionId without jwtToken
    if (sessionId && !jwtToken && !isPublicPath) {
        if (process.env.NODE_ENV === "development") {
            console.log(
                "Partial session detected (sessionId without jwtToken), clearing and redirecting"
            );
        }
        return redirectToLogin();
    }

    // Handle corrupted session: jwtToken without sessionId
    if (jwtToken && !sessionId && !isPublicPath) {
        if (process.env.NODE_ENV === "development") {
            console.log(
                "Corrupted session detected (jwtToken without sessionId), clearing and redirecting"
            );
        }
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
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
