"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <img src="/hero-bg.svg" alt="" className="h-full w-full object-cover" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-black/5">
          <span className="h-2 w-2 rounded-full bg-primary"></span>
          <span className="text-xs font-medium text-text/70">Urban rides, made simple</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mt-6 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-text">
          <span className="text-text">Taxi</span>
          <span className="text-primary">Tera</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-text/70">
          Book your ride instantly.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }} className="mt-8 flex items-center justify-center gap-3">
          <a
            href="#book"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-white shadow-lg shadow-primary/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Book Now
          </a>
          <a
            href="#learn"
            className="inline-flex items-center justify-center rounded-full bg-accent/10 px-6 py-3 text-text shadow-sm ring-1 ring-accent/40 transition hover:bg-accent/20"
          >
            Learn more
          </a>
        </motion.div>
      </div>
    </section>
  );
}


