import type { Metadata } from "next";
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";
import { Merriweather } from "next/font/google";
import { ReduxProvider } from "@/lib/redux/provider";
import QueryProvider from "./providers";

export const metadata: Metadata = {
    title: "The SDG Story",
    description: "GGI-Web"
};

const merriweather = Merriweather({
    subsets: ["latin"],
    weight: ["300", "400", "700", "900"],
    // variable: '--font-merriweather',
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
                <ReduxProvider>
                    <QueryProvider>
                        {children}
                        <Toaster
                            position="top-right"
                            reverseOrder={false}
                            containerStyle={{
                                pointerEvents: 'none',
                            }}
                            toastOptions={{
                                className: "bg-neutral-100 text-neutral-800 shadow-lg",
                                style: {
                                    borderRadius: "10px",
                                    padding: "24px",
                                    fontSize: "18px",
                                    pointerEvents: 'auto', // Fixed: Allow clicking on toasts
                                },
                                success: {
                                    duration: 3000,
                                    iconTheme: {
                                        primary: "#737373",
                                        secondary: "#FAFAFA",
                                    },
                                },
                                error: {
                                    duration: 3000,
                                    iconTheme: {
                                        primary: "#525252",
                                        secondary: "#FAFAFA",
                                    },
                                },
                            }}
                        />
                    </QueryProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
