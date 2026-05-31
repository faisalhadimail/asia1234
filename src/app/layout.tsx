import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "PropertiHub - Temukan Hunian Impian Anda",
  description: "Platform pencarian properti terbaik untuk rumah, apartemen, dan tanah di Indonesia.",
  keywords: ["properti", "rumah", "apartemen", "jual rumah", "beli rumah", "propertihub"],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "PropertiHub",
    title: "PropertiHub - Temukan Hunian Impian Anda",
    description: "Platform pencarian properti terbaik untuk rumah, apartemen, dan tanah di Indonesia.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
        width: 800,
        height: 600,
        alt: "PropertiHub",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta property="fb:app_id" content="" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}