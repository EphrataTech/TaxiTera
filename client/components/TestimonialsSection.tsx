"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Mahder Hawaz",
      role: "Daily Commuter",
      content:
        "TaxiTera has made my daily commute so much easier. The drivers are professional and the app is intuitive.",
      rating: 5,
      image: "mahder.png",
    },
    {
      name: "Robel Alemayehu",
      role: "Business Owner",
      content: "I use TaxiTera for all my business travels. The reliability and transparency are unmatched.",
      rating: 5,
      image: "robel.png",
    },
    {
      name: "Yohannes Assefa",
      role: "Student",
      content: "Affordable, safe, and always on time. TaxiTera is my go-to choice for getting around the city.",
      rating: 5,
      image: "avatar.png",
    },
  ]

  return (
    <section id="testimonials" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            What Our{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Riders Say
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust TaxiTera for their daily transportation needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-2xl bg-card border border-border hover:border-amber-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/10"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-card-foreground mb-6 leading-relaxed">{testimonial.content}</p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
