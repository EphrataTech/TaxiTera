"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export default function About() {
  const features = [
    "Professional, verified drivers",
    "Real-time GPS tracking",
    "Transparent pricing",
    "24/7 customer support",
  ]

  return (
    <section id="about" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            About{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              TaxiTera
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're revolutionizing urban transportation in Addis Ababa with reliable, affordable, and transparent
            ride-sharing services.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img src="/addis-ababa-taxi.png" alt="TaxiTera service" className="rounded-2xl shadow-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg text-foreground/80 leading-relaxed">
              Founded in 2020, TaxiTera has grown to become Addis Ababa's most trusted ride-sharing platform. We connect
              thousands of riders with professional drivers every day.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Our mission is simple: make transportation accessible, safe, and affordable for everyone in Addis Ababa.
            </p>
            <div className="space-y-3 pt-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-amber-400 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
