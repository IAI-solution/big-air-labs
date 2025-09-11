import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/page";
import { League_Spartan } from "next/font/google";
import { Toaster } from "sonner";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // choose the weights you need
  variable: "--font-league-spartan",
  display: "swap",
});


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Big AIR Lab",
  // description: "Smart AI Solutions for Tomorrow",
  icons: {
    icon: [
      { url: "/faviicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/faviicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/faviicons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/faviicons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/faviicons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/faviicons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/faviicons/favicon.ico", type: "image/x-icon" }
    ],
    apple: "/favicons/apple-touch-icon.png",
    shortcut: "/favicons/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
        <link href='https://fonts.googleapis.com/css?family=Spartan' rel='stylesheet'></link>


      </head>
      <body
        className={` ${leagueSpartan.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {/* <div className="mt-[240px]"> */}
        {children}
        <Toaster richColors position="bottom-right" />
        {/* </div> */}
      </body>
    </html>
  );
}
