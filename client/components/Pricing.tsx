"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Pricing() {
  const router = useRouter();
  
  const handleGetStarted = (planName: string) => {
    // Store selected plan in localStorage for booking page
    localStorage.setItem('selectedPlan', planName);
    router.push('/book');
  };
  
  const plans = [
    {
      name: "Economy",
      description: "Perfect for daily commutes",
      price: "Affordable",
      features: ["Standard vehicles", "Real-time tracking", "Basic support", "Ride history"],
    },
    {
      name: "Premium",
      description: "For a more comfortable experience",
      price: "Premium",
      features: ["Premium vehicles", "Priority pickup", "24/7 support", "Ride history", "Loyalty rewards"],
      highlighted: true,
    },
    {
      name: "Business",
      description: "For corporate needs",
      price: "Custom",
      features: ["Dedicated account", "Bulk booking", "Monthly invoicing", "Priority support", "Custom pricing"],
    },
  ]

  return (
    <section id="pricing" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-card-foreground mb-4 text-balance">
            Simple{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you. No hidden fees, no surprises.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-gradient-to-br from-amber-400/10 to-orange-500/10 border-2 border-amber-400 shadow-lg shadow-amber-400/20 scale-105"
                  : "bg-background border border-border hover:border-amber-400/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-card-foreground mb-2">{plan.name}</h3>
              <p className="text-muted-foreground mb-4">{plan.description}</p>
              <div className="text-3xl font-bold text-amber-400 mb-6">{plan.price}</div>
              <button
                onClick={() => handleGetStarted(plan.name)}
                className={`w-full py-3 rounded-lg font-semibold transition-all mb-8 hover:scale-105 ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:shadow-lg hover:shadow-amber-400/40"
                    : "bg-white/10 text-card-foreground border border-white/20 hover:bg-white/20"
                }`}
              >
                Get Started
              </button>
              <div className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span className="text-card-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
