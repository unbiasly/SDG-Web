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
                {/* Additional meta tag for iOS Safari */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover" />
            </head>
            <body 
                className={`${merriweather.className} antialiased bg-[#FFF]`}
                style={{
                    touchAction: 'manipulation', // Prevents double-tap zoom
                    WebkitUserSelect: 'none', // Prevents text selection which can trigger zoom
                    userSelect: 'none',
                    WebkitTouchCallout: 'none', // Prevents callout on iOS
                    WebkitTapHighlightColor: 'transparent' // Removes tap highlight
                }}
            >
                <ReduxProvider>
                    <QueryProvider>{children}</QueryProvider>
                </ReduxProvider>
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    containerStyle={{
                        pointerEvents: 'none', // Prevent hover pause on container
                    }}
                    toastOptions={{
                        className: "bg-neutral-100 text-neutral-800 shadow-lg",
                        style: {
                            borderRadius: "10px",
                            padding: "24px", // Increased padding
                            fontSize: "18px", // Increased font size
                            pointerEvents: 'none', // Allow clicking on individual toasts
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: "#737373", // Neutral gray
                                secondary: "#FAFAFA", // Lighter neutral for contrast
                            },
                        },
                        error: {
                            duration: 3000,
                            iconTheme: {
                                primary: "#525252", // Darker neutral gray
                                secondary: "#FAFAFA", // Lighter neutral for contrast
                            },
                        },
                    }}
                />
            </body>
        </html>
    );
}
