"use client"
import type { Metadata } from "next";

import "@/app/globals.css";
import Logo from '@/public/Logo.svg';
import { UserSidebar } from "@/components/feed/UserProfile";
import Image from "next/image";
import Link from "next/link";
import { setupTokenRefresh } from "@/lib/utilities/tokenRefresh";
import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { fetchUserFailure, fetchUserStart, fetchUserSuccess, setFallbackColor } from "@/lib/redux/features/user/userSlice";
import { getRandomColor } from "@/lib/utilities/generateColor";

export default function VideoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set up the token refresh service worker
    setupTokenRefresh();
    fetchUser();
  }, []);
    
  const fetchUser = async () => {
    dispatch(fetchUserStart());
    try {
      const response = await fetch('/api', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          dispatch(fetchUserFailure('Unauthorized'));
          window.location.href = '/login';
          return null;
        }
      }
      const data = await response.json();
      if (data.data && data.data._id) {
        const fallbackColor = getRandomColor();
        dispatch(setFallbackColor(fallbackColor));
      }
      dispatch(fetchUserSuccess(data));
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch(fetchUserFailure(errorMessage));
      window.location.href = '/login';
      throw error;
    }
  };

  return (
    <main className="flex-1 flex overflow-y-auto p-3 gap-6 max-container">
      <aside className="hidden xl:block space-y-3 sticky h-fit">
        <Link href='/' className="flex justify-center items-center gap-2 px-2">    
          <Image src={Logo} alt='' width={40} height={40} />
          <h1 className='text-xl font-bold'>The SDG Story</h1>
        </Link>
        <UserSidebar />
      </aside>
      <div className="flex flex-col flex-1 space-y-3 w-full ">
        {children}
      </div>
    </main>
  );
}