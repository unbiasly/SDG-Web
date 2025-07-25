import type { Metadata } from "next";
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";
import { Merriweather } from "next/font/google";
import Providers from "./providers";

export const metadata: Metadata = {
    title: "The SDG Story",
    description: "GGI-Web"
};

const merriweather = Merriweather({
    subsets: ["latin"],
    weight: ["300", "400", "700", "900"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover" />
            </head>
            <body 
                className={`${merriweather.className} antialiased bg-[#FFF]`}
                style={{
                    touchAction: 'manipulation', // Prevents double-tap zoom
                    WebkitUserSelect: 'none', // Prevents text selection which can trigger zoom
                    userSelect: 'none',
                    WebkitTouchCallout: 'none',
                    WebkitTapHighlightColor: 'transparent'
                }}
            >
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
