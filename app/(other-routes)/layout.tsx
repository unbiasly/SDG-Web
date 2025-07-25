"use client";
import "../globals.css";
import { UserSidebar } from "@/components/feed/UserProfile";
import { TrendingSection } from "@/components/feed/TrendingNow";
import Image from "next/image";
import React, { useEffect, useCallback, useState } from "react";
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


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const dispatch = useAppDispatch();

    const fetchUser = useCallback(async () => {
        dispatch(fetchUserStart());
        try {
            const response = await fetch(`/api`, {
                credentials: "include",
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message || `Failed to fetch user: ${response.status}`;
                dispatch(fetchUserFailure(errorMessage));
                console.error("Fetch user error:", errorMessage);
                return;
            }

            if (data.data && data.data._id) {
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
        fetchUser();
    }, [fetchUser]);


    return (
        <main className="flex flex-col md:flex-row md:gap-1 h-screen max-container">
            {/* Left Sidebar - Hidden on mobile, visible on desktop */}
            <aside className="hidden md:flex max-w-[250px] lg:flex-1 p-2 space-y-3 h-full flex-col">
                <Link
                    href="/"
                    className="justify-start w-full items-center gap-2 px-2 hidden lg:flex flex-shrink-0"
                >
                    <Image
                        src="/Logo.svg"
                        alt="SDG Logo"
                        width={40}
                        height={40}
                    />
                    <h1 className="text-xl font-bold">The SDG Story</h1>
                </Link>
                <div className="flex-1 min-h-0">
                    <UserSidebar />
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header - Only visible on mobile */}
                <header className="md:hidden flex space-x-2 items-center justify-center bg-white border-b shadow-sm px-2 py-3 sticky top-0 z-50">
                    <UserSidebar />
                    <SearchBar className="w-fit" />
                </header>

                {/* Content */}
                <div className="flex-1 hidden-scrollbar md:overflow-y-auto md:pt-2">
                    {children}
                </div>
            </div>          
        </main>
    );
}

