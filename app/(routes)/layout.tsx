"use client"
import "../globals.css";
import { UserSidebar } from "@/components/feed/UserProfile";
import { TrendingSection } from "@/components/feed/TrendingNow";
import Image from "next/image";
import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { fetchUserFailure, fetchUserStart, fetchUserSuccess, setFallbackColor } from "@/lib/redux/features/user/userSlice";
import Link from "next/link";
import { getRandomColor } from "@/lib/utilities/generateColor";
import SearchBar from "@/components/feed/SearchBar";
import { setupAPIInterceptor } from "@/lib/utilities/interceptor";

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
          const response = await fetch('/api', {
            credentials: 'include'
          });
          
          const data = await response.json();
          if (data.data && data.data._id) {
            // Set fallback color for new users
            const fallbackColor = getRandomColor();
            dispatch(setFallbackColor(fallbackColor));
          }
          dispatch(fetchUserSuccess(data));
          return data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          dispatch(fetchUserFailure(errorMessage));
          // Redirect to login for auth errors
          window.location.href = '/login';
          throw error;
        }
      };
    
  return (
      <main className="flex-1 flex overflow-hidden md:p-3 md:gap-3 lg:gap-6 max-container">
        <aside className="space-y-3 sticky h-fit">
            <Link href='/' className="justify-center items-center gap-2 px-2 hidden lg:flex">    
                <Image src='/Logo.svg' alt='SDG Logo' width={40} height={40}  />
                <h1 className='text-xl font-bold'>The SDG Story</h1>
            </Link>
            <div className="hidden md:block"><UserSidebar /></div>
        </aside>
        
        {/* Optimized main content div */}
        <div className="lg:gap-0 gap-2 p-2 flex-1 min-w-0 overflow-y-auto">
            <div className="flex space-x-2 items-center mb-3 justify-between md:hidden sticky top-0 z-10 bg-white/95 py-1">
                <UserSidebar />
                <SearchBar className="w-fit"/>
            </div>
            <div className="pb-4">
                {children}
            </div>
        </div>
        
        <aside className="hidden xl:block sticky space-y-3">
            <SearchBar />
            <TrendingSection />
        </aside>
    </main>
  );
}
