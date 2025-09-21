import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";

import "./globals.css";

const mono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Pixel Petri",
  description: "Cultivate pixel microbes in your browser lab."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mono.className} min-h-screen`}>{children}</body>
    </html>
  );
}
