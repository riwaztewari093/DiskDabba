import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://diskdabba.pages.dev"),
  title: "DiskDabba — Store • Stream • Share | Next-Gen Cloud Platform",
  description:
    "Upload, stream, share and monetize your high-resolution videos and files. Ultra-fast cloud vault with Liquid Retina playback.",
  icons: {
    icon: "/icon.jpg",
    shortcut: "/icon.jpg",
    apple: "/logo-square.jpg",
  },
  openGraph: {
    title: "DiskDabba — Store • Stream • Share",
    description:
      "Ultra-fast cloud storage and video streaming platform. Upload, share, and monetize seamlessly.",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#fafcff] text-slate-900 selection:bg-sky-100 selection:text-sky-900 font-sans">
        {children}
      </body>
    </html>
  );
}
