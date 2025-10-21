import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: 'TaxiTera - Your Trusted Transportation Partner',
  description: 'Book reliable taxi rides in Addis Ababa with TaxiTera. Fast, secure, and affordable transportation service.',
  icons: {
    icon: '/taxilogo.png',
    shortcut: '/taxilogo.png',
    apple: '/taxilogo.png',
  },
  manifest: '/manifest.json',
  themeColor: '#f59e0b',
  other: {
    'msapplication-TileColor': '#f59e0b',
    'msapplication-TileImage': '/taxilogo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}