"use client";
import "../globals.css";
import { UserSidebar } from "@/components/feed/UserProfile";
import { TrendingSection } from "@/components/feed/TrendingNow";
import Image from "next/image";
import React, { useEffect, useCallback } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
    fetchUserFailure,
    fetchUserStart,
    fetchUserSuccess,
    setFallbackColor,
} from "@/lib/redux/features/user/userSlice";
import Link from "next/link";
import { getRandomColor } from "@/lib/utilities/generateColor";
import SearchBar from "@/components/feed/SearchBar";
import { setupAPIInterceptor } from "@/lib/utilities/interceptor";
import { AppApi } from "@/service/app.api";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const dispatch = useAppDispatch();

    // Consolidated session validation function
    const validateSession = useCallback(async () => {
        const sessionId = await AppApi.getCookie("sessionId");
        const jwtToken = await AppApi.getCookie("jwtToken");
        return { sessionId, jwtToken, isValid: !!(sessionId && jwtToken) };
    }, []);

    // Consolidated redirect function
    const redirectToLogin = useCallback(async (reason: string) => {
        console.log(`${reason}, redirecting to login`);
        
        // Clear any remaining cookies and cache
        try {
            await fetch('/api/logout', { 
                method: 'POST',
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
        } catch (error) {
            console.error('Error during cleanup logout:', error);
        }
        
        // Force hard reload to clear cache with timestamp
        window.location.href = `/login?t=${Date.now()}`;
    }, []);

    // Main session check function
    const checkSessionAndRedirect = useCallback(async () => {
        const { isValid } = await validateSession();
        if (!isValid) {
            await redirectToLogin("Invalid or missing session");
        }
    }, [validateSession, redirectToLogin]);

    const fetchUser = useCallback(async () => {
        dispatch(fetchUserStart());
        try {
            // Add cache busting parameter and no-cache headers
            const response = await fetch(`/api?t=${Date.now()}`, {
                credentials: "include",
                cache: 'no-store', // Prevent caching
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle HTTP errors based on response status
                const errorMessage = data.message || `Failed to fetch user: ${response.status}`;
                dispatch(fetchUserFailure(errorMessage));
                console.error("Fetch user error:", errorMessage);
                return;
            }

            if (data.data && data.data._id) {
                // Set fallback color for new users
                const fallbackColor = getRandomColor();
                dispatch(setFallbackColor(fallbackColor));
            }
            dispatch(fetchUserSuccess(data));
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred";
            dispatch(fetchUserFailure(errorMessage));
            console.error("Fetch user exception:", errorMessage);
        }
    }, [dispatch]);

    useEffect(() => {
        setupAPIInterceptor();
        fetchUser();
    }, [fetchUser]);

    // Initial session check
    useEffect(() => {
        checkSessionAndRedirect();
    }, [checkSessionAndRedirect]);

    // Add effect to prevent caching on protected routes
    useEffect(() => {
        // Set meta tags to prevent caching
        const addMetaTag = (name: string, content: string) => {
            const existing = document.querySelector(`meta[http-equiv="${name}"]`);
            if (existing) existing.remove();
            
            const meta = document.createElement('meta');
            meta.httpEquiv = name;
            meta.content = content;
            document.getElementsByTagName('head')[0].appendChild(meta);
            return meta;
        };

        const metaNoCache = addMetaTag('Cache-Control', 'no-cache, no-store, must-revalidate');
        const metaPragma = addMetaTag('Pragma', 'no-cache');
        const metaExpires = addMetaTag('Expires', '0');

        // Force revalidation by adding timestamp to current URL if not already present
        const currentUrl = new URL(window.location.href);
        if (!currentUrl.searchParams.has('t')) {
            const newUrl = `${window.location.pathname}${window.location.search}${window.location.search ? '&' : '?'}t=${Date.now()}`;
            window.history.replaceState({}, '', newUrl);
        }

        // Add visibility change listener to revalidate when tab becomes visible
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // Tab became visible, check session again
                checkSessionAndRedirect();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup function
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            try {
                metaNoCache?.remove();
                metaPragma?.remove();
                metaExpires?.remove();
            } catch (e) {
                // Ignore cleanup errors
            }
        };
    }, [checkSessionAndRedirect]);

    // Add periodic session check
    useEffect(() => {
        const sessionCheckInterval = setInterval(async () => {
            const { isValid } = await validateSession();
            if (!isValid) {
                console.log("Periodic session check failed, redirecting to login");
                clearInterval(sessionCheckInterval);
                await redirectToLogin("Session expired during periodic check");
            }
        }, 30000); // Check every 30 seconds

        return () => clearInterval(sessionCheckInterval);
    }, [validateSession, redirectToLogin]);

    return (
        <main className="flex flex-col md:flex-row md:gap-3 h-screen max-container">
            {/* Left Sidebar - Hidden on mobile, visible on desktop */}
            <aside className="hidden md:block max-w-[250px] lg:flex-1 p-2 space-y-3 overflow-y-auto">
                <Link
                    href="/"
                    className="justify-center items-center gap-2 px-2 hidden lg:flex"
                >
                    <Image
                        src="/Logo.svg"
                        alt="SDG Logo"
                        width={40}
                        height={40}
                    />
                    <h1 className="text-xl font-bold">The SDG Story</h1>
                </Link>
                <div className="flex-1"><UserSidebar /></div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header - Only visible on mobile */}
                <header className="md:hidden flex space-x-2 items-center justify-center bg-white border-b shadow-sm px-2 py-3 sticky top-0 z-50">
                    <UserSidebar />
                    <SearchBar className="w-fit" />
                </header>

                {/* Content */}
                <div className="flex-1 hidden-scrollbar md:overflow-y-auto p-2 md:pt-2">
                    {children}
                </div>
            </div>

            {/* Right Sidebar - Hidden on mobile and tablet, visible on large screens */}
            <aside className="hidden lg:block max-w-[250px] flex-1 p-2 space-y-3 overflow-y-auto">
                <div className="lg:block hidden">
                    <SearchBar />
                </div>
                <TrendingSection />
            </aside>
        </main>
    );
}
