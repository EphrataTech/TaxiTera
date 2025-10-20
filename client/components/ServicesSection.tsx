"use client"

import { motion } from "framer-motion"
import { Zap, Shield, DollarSign, Clock } from "lucide-react"

export default function Services() {
  const services = [
    {
      icon: Zap,
      title: "Quick Pickup",
      description: "Average pickup time of 2-5 minutes. We're always nearby when you need us.",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "All drivers are verified and insured. Your safety is our top priority.",
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "No hidden charges. Know your fare before you book.",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Available round the clock. We're here whenever you need a ride.",
    },
  ]

  return (
    <section id="services" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Our{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience premium ride-sharing with features designed for your comfort and convenience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-amber-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Icon className="w-12 h-12 text-amber-400 mb-4" />
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
