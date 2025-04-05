import type { Metadata } from "next";
import '@/app/globals.css'
import { Toaster } from "@/components/ui/sonner";
import { gilroy } from "@/lib/fonts";
import { ReduxProvider } from "@/lib/redux/provider";


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
        className={`${gilroy.variable} antialiased bg-[#FFF]`}
      >
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
