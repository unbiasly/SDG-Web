import type { Metadata } from "next";

import "../globals.css";
import Logo from '@/public/Logo.svg';
import { UserSidebar } from "@/components/feed/UserProfile";
import { TrendingSection } from "@/components/feed/TrendingNow";
import Image from "next/image";
import { Search } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-1 flex overflow-y-auto p-3 gap-6 max-container">
      <aside className="hidden xl:block space-y-3 sticky h-fit ">
        <div className="flex justify-center items-center gap-2 px-2">    
          <Image src={Logo} alt='' width={40} height={40} />
          <h1 className='text-xl font-bold'>The SDG Story</h1>
        </div>
        <UserSidebar />
      </aside>
      <div className="flex flex-col flex-1 space-y-3">
        
        {children}
      </div>
    </main>
  );
}