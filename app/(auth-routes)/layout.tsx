import type { Metadata } from "next";
import "@/app/globals.css";
import ImageSlider from "@/components/login/ImageSlider";

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
        <main className="h-screen md:px-20">
                <div className="flex flex-col lg:flex-row w-full justify-center  h-screen">
                    {/* Left side - Image */}
                    <div className="hidden lg:flex justify-center items-center  w-1/2 relative">
                        <ImageSlider />
                    </div>

                    {/* Right side - Sign In Form */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center ">
                        {children}
                    </div>
                </div>
        </main>
    );
}
