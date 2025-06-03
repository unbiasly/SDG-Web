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
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCookie } from "@/service/app.api";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const dispatch = useAppDispatch();

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

    useEffect(() => {
        const checkSessionAndRedirect = async () => {
            const sessionId = await getCookie("sessionId");
            const jwtToken = await getCookie("jwtToken");
            
            // More strict session validation
            if (!sessionId || !jwtToken) {
                console.log("Invalid or missing session, redirecting to login");
                
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
            }
        };
        
        checkSessionAndRedirect();
    }, []);

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

        const checkSessionAndRedirect = async () => {
            const sessionId = await getCookie("sessionId");
            const jwtToken = await getCookie("jwtToken");
            
            if (!sessionId || !jwtToken) {
                console.log("Session expired, redirecting to login");
                window.location.href = `/login?t=${Date.now()}`;
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
    }, []);

    // Add storage event listener to detect logout from other tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'user_logout' && e.newValue === 'true') {
                // User logged out from another tab
                localStorage.removeItem('user_logout');
                window.location.href = `/login?t=${Date.now()}`;
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Add periodic session check
    useEffect(() => {
        const sessionCheckInterval = setInterval(async () => {
            const sessionId = await getCookie("sessionId");
            const jwtToken = await getCookie("jwtToken");
            
            if (!sessionId || !jwtToken) {
                console.log("Periodic session check failed, redirecting to login");
                clearInterval(sessionCheckInterval);
                window.location.href = `/login?t=${Date.now()}`;
            }
        }, 30000); // Check every 30 seconds

        return () => clearInterval(sessionCheckInterval);
    }, []);

    return (
        <main className="max-h-screen flex  md:gap-3  max-container">
            <aside className="max-w-[250px] p-2 space-y-3 max-h-screen self-start  hidden md:block ">
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
                <div className="hidden md:block flex-1">
                    <UserSidebar />
                </div>
            </aside>

            {/* Optimized main content div */}
            <div className="flex-1 lg:gap-0 gap-2  relative">
                <div className="flex space-x-2 items-center justify-center md:hidden z-20 bg-white sticky top-0 left-0 right-0 p-2 border-b shadow-sm">
                    <UserSidebar />
                    <SearchBar className="w-fit" />
                </div>
                <ScrollArea
                    className="flex-1 md:py-2 min-w-0 h-[calc(100vh)] overflow-y-auto"
                    showScrollbar={false}
                >
                    {children}
                </ScrollArea>
            </div>

            <aside className="max-w-[250px] p-2 space-y-3 max-h-screen self-start hidden-scrollbar hidden lg:block">
                <SearchBar />
                <TrendingSection />
            </aside>
        </main>
    );
}
