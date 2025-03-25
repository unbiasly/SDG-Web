import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../globals.css";
import Logo from '@/public/Logo.svg';
import { UserSidebar } from "@/components/feed/UserProfile";
import { TrendingSection } from "@/components/feed/TrendingNow";
import Image from "next/image";
import { Search } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The SDG Story",
  description: "GGI-Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  antialiased  bg-[#FFF] `}
      >
        <main className="flex-1 flex overflow-y-auto p-3 gap-6 max-container">
            <aside className="hidden xl:block space-y-3  sticky h-fit">
                <div className="flex justify-center items-center gap-2 px-2">    
                    <Image src={Logo} alt='' width={40} height={40}  />
                    <h1 className='text-xl font-bold'>The SDG Story</h1>
                </div>
                <UserSidebar />
            </aside>
            {children}
          <aside className="hidden xl:block sticky space-y-3 ">
          <div className="relative  rounded-2xl flex-1 w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Search"
                className="w-full h-10 pl-10 pr-4 rounded-2xl bg-sdg-gray text-sm outline-none ring-1 ring-gray-300 transition-all duration-200"
            />
          </div>
            <TrendingSection />
          </aside>
        </main>
      </body>
    </html>
  );
}
