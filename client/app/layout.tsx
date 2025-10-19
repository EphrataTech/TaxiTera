"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

function Navigation() {
  const { isAuthenticated, hydrated, user, clearSession } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.push('/');
  };

  // Always render the same structure to avoid hydration mismatch
  return (
    <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
      {!hydrated ? (
        <div className="animate-pulse bg-gray-600 h-4 w-16 rounded"></div>
      ) : isAuthenticated ? (
        <>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <Link href="/feedback" className="hover:text-white transition-colors">Feedback</Link>
          <span className="text-gray-400">Hi, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-2 rounded-full text-sm hover:bg-red-500/30 transition-colors"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <Link href="/login" className="hover:text-white transition-colors">Login</Link>
          <Link href="/register" className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-6 py-2 rounded-full hover:scale-105 transition-all shadow-lg">
            Book a Ride
          </Link>
        </>
      )}
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">TaxiTera</span>
              </Link>
              <Navigation />
            </div>
          </header>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}