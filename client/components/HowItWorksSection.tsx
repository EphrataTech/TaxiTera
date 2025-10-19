"use client"

import { motion } from "framer-motion"
import { Smartphone, MapPin, Users, CheckCircle } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: Smartphone,
      title: "Create Account",
      description: "Sign up with your email and phone number to get started with TaxiTera.",
    },
    {
      icon: MapPin,
      title: "Select Route",
      description: "Choose your pickup and destination from popular Addis Ababa locations.",
    },
    {
      icon: Users,
      title: "Book Seats",
      description: "Select your preferred taxi type and number of seats for your journey.",
    },
    {
      icon: CheckCircle,
      title: "Get QR Ticket",
      description: "Complete payment and receive your digital QR code ticket instantly.",
    },
  ]

  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-card-foreground mb-4 text-balance">
            How It{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Booking your taxi is quick and easy. Follow these simple steps to get your digital ticket.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-lg opacity-30"></div>
                    <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-4 shadow-lg">
                      <Icon className="w-8 h-8 text-black" />
                    </div>
                  </div>
                  <div className="absolute -top-8 -right-4 text-4xl font-bold text-amber-400/20">{index + 1}</div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 -right-4 w-8 h-0.5 bg-gradient-to-r from-amber-400 to-transparent"></div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

