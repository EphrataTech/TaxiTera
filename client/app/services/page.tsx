"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ServicesPage() {
  const { isAuthenticated } = useAuth();

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
              Our <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Choose from our range of transportation options designed to meet your needs and budget in Addis Ababa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Minibus Service */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-6xl mb-6 text-center">🚐</div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Minibus</h3>
              <p className="text-white/70 mb-6 text-center">Perfect for small groups and families. Comfortable seating for up to 12 passengers with professional service.</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span className="text-white/80 text-sm">12 passenger capacity</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span className="text-white/80 text-sm">Air conditioning</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span className="text-white/80 text-sm">Professional driver</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span className="text-white/80 text-sm">Standard pricing</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">$15-45</div>
                <div className="text-white/60 text-sm">per person</div>
              </div>
            </div>

            {/* Higer Service */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold">POPULAR</span>
              </div>
              <div className="text-6xl mb-6 text-center">🚌</div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Higer</h3>
              <p className="text-white/70 mb-6 text-center">Economy option for larger groups. Spacious and comfortable for longer journeys with great value.</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span className="text-white/80 text-sm">45 passenger capacity</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span className="text-white/80 text-sm">Climate control</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span className="text-white/80 text-sm">Experienced driver</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-green-300 text-sm font-medium">20% cheaper per person</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">$12-36</div>
                <div className="text-white/60 text-sm">per person</div>
              </div>
            </div>

            {/* Bus Service */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-6xl mb-6 text-center">🚍</div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Bus</h3>
              <p className="text-white/70 mb-6 text-center">Budget-friendly option for large groups. Most economical way to travel together across the city.</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span className="text-white/80 text-sm">50 passenger capacity</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span className="text-white/80 text-sm">Basic amenities</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span className="text-white/80 text-sm">Licensed driver</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-blue-300 text-sm font-medium">30% cheaper per person</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">$10-32</div>
                <div className="text-white/60 text-sm">per person</div>
              </div>
            </div>
          </div>

          {/* Additional Services */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Additional Services</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-white mb-3">Advance Booking</h3>
                <p className="text-white/70">Schedule your rides up to 7 days in advance. Perfect for airport transfers, important meetings, or planned events.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-bold text-white mb-3">Corporate Packages</h3>
                <p className="text-white/70">Special rates for businesses and organizations. Bulk booking discounts and dedicated account management available.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-white mb-3">Custom Routes</h3>
                <p className="text-white/70">Need a specific route not in our system? Contact us for custom routing and special destination requests.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎧</div>
                <h3 className="text-xl font-bold text-white mb-3">Premium Support</h3>
                <p className="text-white/70">24/7 customer support with priority assistance for urgent travel needs and emergency situations.</p>
              </div>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-3xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-6">Transparent Pricing</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-amber-400 font-bold mb-2">✓ No Hidden Fees</div>
                <p className="text-white/70 text-sm">What you see is what you pay</p>
              </div>
              <div>
                <div className="text-amber-400 font-bold mb-2">✓ No Surge Pricing</div>
                <p className="text-white/70 text-sm">Same fair rates all day long</p>
              </div>
              <div>
                <div className="text-amber-400 font-bold mb-2">✓ Group Discounts</div>
                <p className="text-white/70 text-sm">Better rates for larger vehicles</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href={isAuthenticated ? "/book" : "/register"}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-lg font-semibold text-black shadow-2xl shadow-amber-500/40 transition-all hover:shadow-amber-500/60 hover:scale-105"
            >
              {isAuthenticated ? "Book Your Ride Now" : "Get Started Today"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}