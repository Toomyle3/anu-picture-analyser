import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "./provider/ConvexClerkProvider";
import AudioProvider from "./provider/AudioProvider";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tommy AI",
  description: "Generate everything with AI",
  icons: {
    icon: "/icons/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <AudioProvider>
          <body className={`${manrope.className}`}>{children}</body>
        </AudioProvider>
      </html>
    </ConvexClerkProvider>
  );
}
