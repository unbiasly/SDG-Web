import type { Metadata } from "next";
import '@/app/globals.css'
import { Toaster } from "@/components/ui/sonner";
// import { gilroy } from "@/lib/fonts";
import { Merriweather } from "next/font/google";
import { ReduxProvider } from "@/lib/redux/provider";
import QueryProvider from "./providers";


export const metadata: Metadata = {
  title: "The SDG Story",
  description: "GGI-Web",
};

const merriweather = Merriweather({
    subsets: ['latin'],
    weight: ['300', '400', '700', '900'],
    // variable: '--font-merriweather',
  })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;

}>) {
  return (
    <html lang="en">
      <body
        className={`${merriweather.className} antialiased bg-[#FFF]`}
      >
        <ReduxProvider>
            <QueryProvider>
          {children}
            </QueryProvider>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
