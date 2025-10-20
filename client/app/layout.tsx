"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

function Navigation() {
  const { isAuthenticated, hydrated, user, clearSession } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!hydrated) {
    return (
      <div className="flex items-center gap-4">
        <div className="animate-pulse bg-gray-600 h-4 w-16 rounded"></div>
        <div className="animate-pulse bg-gray-600 h-4 w-16 rounded"></div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6 text-sm">
        <Link href="/" className="text-white/80 hover:text-white transition-colors font-medium">
          Home
        </Link>
        <Link href="/about" className="text-white/80 hover:text-white transition-colors font-medium">
          About
        </Link>
        <Link href="/services" className="text-white/80 hover:text-white transition-colors font-medium">
          Services
        </Link>
        {isAuthenticated ? (
          <>
            <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/book" className="text-white/80 hover:text-white transition-colors font-medium">
              Book Ride
            </Link>
            <Link href="/profile" className="text-white/80 hover:text-white transition-colors font-medium">
              Profile
            </Link>
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/20">
              <span className="text-white/60 text-xs">Hi, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 border border-red-400/30 text-red-300 px-3 py-1.5 rounded-full text-xs hover:bg-red-500/30 transition-colors"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="text-white/80 hover:text-white transition-colors font-medium">
              Sign In
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-4 py-2 rounded-full hover:scale-105 transition-all shadow-lg font-medium">
              Get Started
            </Link>
          </>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 text-white hover:text-amber-400 transition-colors"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu}></div>
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gray-900/95 backdrop-blur-md border-l border-gray-700/50 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xl font-bold">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Taxi</span>
                  <span className="text-white">Tera</span>
                </span>
              </div>
              <button onClick={closeMobileMenu} className="p-2 text-white hover:text-amber-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="p-4 space-y-2">
              <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-xl transition-colors">
                <span>🏠</span>
                <span>Home</span>
              </Link>
              <Link href="/about" onClick={closeMobileMenu} className="flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-xl transition-colors">
                <span>ℹ️</span>
                <span>About</span>
              </Link>
              <Link href="/services" onClick={closeMobileMenu} className="flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-xl transition-colors">
                <span>🚗</span>
                <span>Services</span>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <div className="border-t border-gray-700/50 my-4 pt-4">
                    <div className="px-3 py-2 text-white/60 text-sm">Hi, {user?.name}!</div>
                  </div>
                  <Link href="/dashboard" onClick={closeMobileMenu} className="flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-xl transition-colors">
                    <span>📊</span>
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/book" onClick={closeMobileMenu} className="flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-xl transition-colors">
                    <span>🚌</span>
                    <span>Book Ride</span>
                  </Link>
                  <Link href="/profile" onClick={closeMobileMenu} className="flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-xl transition-colors">
                    <span>👤</span>
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 w-full text-left text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-700/50 my-4 pt-4"></div>
                  <Link href="/login" onClick={closeMobileMenu} className="flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-xl transition-colors">
                    <span>🔑</span>
                    <span>Sign In</span>
                  </Link>
                  <Link href="/register" onClick={closeMobileMenu} className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black rounded-xl font-medium hover:scale-105 transition-all">
                    <span>🚀</span>
                    <span>Get Started</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
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
          <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2 hover:scale-105 transition-transform">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                </div>
                <span className="text-lg sm:text-xl md:text-2xl font-bold">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Taxi</span>
                  <span className="text-white">Tera</span>
                </span>
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