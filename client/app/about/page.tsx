"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="absolute inset-0 -z-10">
        <img src="/addisababa.png" alt="Addis Ababa" className="h-full w-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95" />
      </div>

      <div className="relative px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              About <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">TaxiTera</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              We're revolutionizing urban transportation in Addis Ababa with reliable, affordable, and transparent ride-sharing services.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                Founded in 2020, TaxiTera emerged from a simple vision: to make transportation in Addis Ababa more accessible, reliable, and affordable for everyone.
              </p>
              <p className="text-white/70 mb-6 leading-relaxed">
                Today, we connect thousands of riders with professional drivers every day, facilitating safe and comfortable journeys across the beautiful city of Addis Ababa.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-amber-400 mb-2">50K+</div>
                  <div className="text-white/70">Active Riders</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-400 mb-2">4.8★</div>
                  <div className="text-white/70">Average Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-400 mb-2">24/7</div>
                  <div className="text-white/70">Support</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-400 mb-2">100%</div>
                  <div className="text-white/70">Verified Drivers</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Why Choose TaxiTera?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-white font-semibold mb-2">Verified Drivers</h3>
                <p className="text-white/70 text-sm">All drivers undergo background checks</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-white font-semibold mb-2">Real-time Tracking</h3>
                <p className="text-white/70 text-sm">Track your ride with GPS technology</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-white font-semibold mb-2">Transparent Pricing</h3>
                <p className="text-white/70 text-sm">No hidden fees or surge pricing</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎧</div>
                <h3 className="text-white font-semibold mb-2">24/7 Support</h3>
                <p className="text-white/70 text-sm">Round-the-clock customer service</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-white font-semibold mb-2">Easy Booking</h3>
                <p className="text-white/70 text-sm">Simple app interface for quick bookings</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-white font-semibold mb-2">Fast Pickup</h3>
                <p className="text-white/70 text-sm">Average pickup time of 2-5 minutes</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-lg font-semibold text-black shadow-2xl shadow-amber-500/40 transition-all hover:shadow-amber-500/60 hover:scale-105"
            >
              Join TaxiTera Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}