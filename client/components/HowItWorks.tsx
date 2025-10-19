"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    { title: "Choose route", desc: "Select pickup and destination stations." },
    { title: "Pick time", desc: "Set date/time and passengers." },
    { title: "Book & ride", desc: "Confirm and get your e-ticket instantly." },
  ];
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-text text-center">How it works</h2>
        <ol className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs rounded-full bg-primary/10 px-2 py-1 text-primary ring-1 ring-primary/30">Step {i + 1}</span>
              </div>
              <h3 className="mt-3 font-semibold text-text">{s.title}</h3>
              <p className="mt-2 text-sm text-text/70">{s.desc}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}


