"use client"

import { motion } from "framer-motion"
import { ArrowRight, MapPin, Clock } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 -z-10">
        <img src="/addisababa.png" alt="Addis Ababa city skyline" className="h-full w-full object-cover" />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 shadow-lg"
        >
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-sm font-medium text-white">Available in Addis Ababa</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white text-balance">
            Your Ride,
            <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Your Way
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white/80 text-balance leading-relaxed"
        >
          Book reliable, affordable rides across Addis Ababa. Fast pickup, trusted drivers, and transparent pricing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/70 text-sm"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>2-5 min pickup</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span>All neighborhoods</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#book"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-lg font-semibold text-black shadow-2xl shadow-amber-500/40 transition-all hover:shadow-amber-500/60 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Book Now
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#learn"
            className="inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md px-8 py-4 text-lg font-semibold text-white border border-white/20 transition-all hover:bg-white/20 hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Learn More
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 flex items-center justify-center gap-8 text-white/60 text-sm"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white">50K+</div>
            <div>Active Riders</div>
          </div>
          <div className="w-px h-12 bg-white/20"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">4.8★</div>
            <div>Average Rating</div>
          </div>
          <div className="w-px h-12 bg-white/20"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">24/7</div>
            <div>Support</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

