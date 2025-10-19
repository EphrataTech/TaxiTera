"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: "How do I book a ride?",
      answer:
        "Download the TaxiTera app, create an account, enter your pickup and destination, and confirm your booking. A driver will be matched to you within minutes.",
    },
    {
      question: "Are the drivers verified?",
      answer:
        "Yes, all our drivers undergo thorough background checks and verification. Your safety is our top priority.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, mobile money (Telebirr, M-Birr), and card payments through our app.",
    },
    {
      question: "Can I schedule a ride in advance?",
      answer: "Yes, you can schedule rides up to 7 days in advance through the app.",
    },
    {
      question: "What if I have an issue with my ride?",
      answer:
        "Our 24/7 customer support team is always available to help. Contact us through the app or call our support line.",
    },
    {
      question: "Do you offer corporate accounts?",
      answer: "Yes, we offer customized corporate packages with dedicated support and bulk booking options.",
    },
  ]

  return (
    <section id="faq" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-card-foreground mb-4 text-balance">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">Find answers to common questions about TaxiTera.</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="rounded-lg border border-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-4 flex items-center justify-between bg-background hover:bg-background/80 transition-colors"
              >
                <span className="text-lg font-semibold text-card-foreground text-left">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-amber-400 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 py-4 bg-background/50 border-t border-border"
                >
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
