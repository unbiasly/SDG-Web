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


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const dispatch = useAppDispatch();

    const fetchUser = useCallback(async () => {
        dispatch(fetchUserStart());
        try {
            const response = await fetch("/api", {
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle HTTP errors based on response status
                const errorMessage = data.message || `Failed to fetch user: ${response.status}`;
                dispatch(fetchUserFailure(errorMessage));
                // No hard redirect here; interceptor should handle auth errors (401/403)
                // For other errors, the UI can show a message based on Redux state
                console.error("Fetch user error:", errorMessage);
                return; // Exit if response is not ok
            }

            if (data.data && data.data._id) {
                // Set fallback color for new users
                const fallbackColor = getRandomColor();
                dispatch(setFallbackColor(fallbackColor));
            }
            dispatch(fetchUserSuccess(data));
            // return data; // Return data if needed by other parts, though not used in this snippet
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred";
            dispatch(fetchUserFailure(errorMessage));
            console.error("Fetch user exception:", errorMessage);
            // throw error; // Re-throwing might be useful if something upstream needs to catch it
                         // but avoid if it causes unhandled promise rejections without specific need.
                         // The interceptor should handle auth-related redirects.
        }
    }, [dispatch]); // dispatch is a stable dependency

    useEffect(() => {
        setupAPIInterceptor();
        fetchUser();
    }, [fetchUser]); // Added fetchUser to dependency array


    return (
        <main className="max-h-screen flex  md:gap-3  max-container">
            <aside className="max-w-[250px] p-2 space-y-3 max-h-screen self-start overflow-y-auto hidden md:block ">
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
                <div className="hidden md:block">
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

            <aside className="max-w-[250px] p-2 space-y-3 max-h-screen self-start overflow-y-auto hidden-scrollbar hidden lg:block">
                <SearchBar />
                <TrendingSection />
            </aside>
        </main>
    );
}
