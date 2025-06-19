"use client";
import type { Metadata } from "next";

import "@/app/globals.css";
import { UserSidebar } from "@/components/feed/UserProfile";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
    fetchUserFailure,
    fetchUserStart,
    fetchUserSuccess,
    setFallbackColor,
} from "@/lib/redux/features/user/userSlice";
import { getRandomColor } from "@/lib/utilities/generateColor";
import { setupAPIInterceptor } from "@/lib/utilities/interceptor";
import SearchBar from "@/components/feed/SearchBar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        setupAPIInterceptor();
        fetchUser();
    }, []);

    const fetchUser = async () => {
        dispatch(fetchUserStart());
        try {
            const response = await fetch("/api", {
                credentials: "include",
            });
            const data = await response.json();
            if (data.data && data.data._id) {
                const fallbackColor = getRandomColor();
                dispatch(setFallbackColor(fallbackColor));
            }
            dispatch(fetchUserSuccess(data));
            return data;
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred";
            dispatch(fetchUserFailure(errorMessage));
            window.location.href = "/login";
            throw error;
        }
    };

    return (
        <main className=" flex overflow-y-auto h-screen gap-3 max-container">
            <aside className="max-w-[250px] lg:flex-1 p-2 space-y-3 max-h-screen self-start  hidden md:block ">
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
                <div className="flex-1">
                    <UserSidebar />
                </div>
            </aside>

            {/* Optimized main content div */}
            <div className="flex-1 lg:gap-0 gap-2  relative">
                <div className="flex space-x-2 items-center justify-center md:hidden z-20 bg-white sticky top-0 left-0 right-0 p-2 border-b shadow-sm">
                    <UserSidebar />
                    <SearchBar className="w-fit" />
                </div>
                <div className="flex-1 pt-2 lg:gap-0 gap-2 relative flex flex-col"
                    style={{
                            height: '100%',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            WebkitOverflowScrolling: 'touch',
                        }}>
                        {children}
                </div>
            </div>
        </main>
    );
}
