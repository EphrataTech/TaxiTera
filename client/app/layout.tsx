import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToastViewport from "@/components/ui/Toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaxiTera",
  description: "Book your ride instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-background text-text`}>
        {children}
        <ToastViewport />
      </body>
    </html>
  );
}
