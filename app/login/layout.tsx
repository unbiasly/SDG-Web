import type { Metadata } from "next";
import '@/app/globals.css'

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
        className=''
      >
            {children}
      </body>
    </html>
  );
}
