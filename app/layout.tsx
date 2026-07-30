import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HashScrollFix } from "./hash-scroll-fix";
import { NavActiveTracker } from "./nav-active-tracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nurzaman7.github.io"),
  title: {
    default: "Nurzaman Ahmed — Research & Development",
    template: "%s — Nurzaman Ahmed",
  },
  description:
    "Engineering research scientist working across Wi-Fi MAC, embedded wireless systems, interoperable AI, edge computing, IoT, and digital agriculture.",
  keywords: [
    "Nurzaman Ahmed",
    "Wi-Fi MAC",
    "IEEE 802.11ah",
    "Wi-Fi HaLow",
    "Linux wireless drivers",
    "mac80211",
    "ath9k",
    "embedded wireless systems",
    "Bluetooth Low Energy",
    "Zephyr RTOS",
    "agentic AI",
    "interoperable AI",
    "Internet of Things",
    "edge computing",
    "precision agriculture",
    "research scientist",
  ],
  authors: [{ name: "Nurzaman Ahmed" }],
  creator: "Nurzaman Ahmed",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Nurzaman Ahmed",
    title: "Nurzaman Ahmed — Wi-Fi MAC, Embedded Wireless & AI Systems",
    description:
      "Research and development across Wi-Fi MAC, embedded wireless, interoperable AI, edge-cloud systems, IoT, and digital agriculture.",
    images: [
      {
        url: "/og-terminal-v2.png",
        width: 1536,
        height: 1024,
        alt: "Nurzaman Ahmed — Research and Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nurzaman Ahmed — Research & Development",
    description:
      "Wi-Fi MAC, embedded wireless, interoperable AI, edge-cloud systems, IoT, and digital agriculture.",
    images: ["/og-terminal-v2.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f4f4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HashScrollFix />
        <NavActiveTracker />
        {children}
      </body>
    </html>
  );
}
