"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Star, Shield, Clock, Users } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Book Ride", href: "/book" },
    { name: "Pricing", href: "/#pricing" }
  ]

  const supportLinks = [
    { name: "Help Center", href: "#" },
    { name: "Contact Us", href: "#contact" },
    { name: "Safety Guidelines", href: "#" },
    { name: "Driver Portal", href: "#" }
  ]

  const features = [
    { icon: Shield, text: "Safe & Secure" },
    { icon: Clock, text: "24/7 Available" },
    { icon: Users, text: "Professional Drivers" },
    { icon: Star, text: "5-Star Service" }
  ]

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Top Section - Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 pb-8 sm:pb-12 border-b border-white/10"
        >
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <feature.icon className="w-6 h-6 text-black" />
              </div>
              <p className="text-white/80 text-sm font-medium">{feature.text}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="sm:col-span-2 lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                TaxiTera
              </h3>
            </div>
            <p className="text-white/70 mb-6 text-lg leading-relaxed">
              Ethiopia's premier ride-sharing platform connecting passengers with professional drivers across Addis Ababa. Safe, reliable, and affordable transportation at your fingertips.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-amber-400 hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 hover:text-black transition-all duration-300 shadow-lg hover:shadow-amber-400/25"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold text-white mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-white/70 hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold text-white mb-6 text-lg">Support</h4>
            <ul className="space-y-4">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-white/70 hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
              <h5 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                24/7 Support
              </h5>
              <a href="tel:+251934344546" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                +251 934 344 546
              </a>
            </div>
          </motion.div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-white/10"
        >
          <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-black" />
            </div>
            <div>
              <h5 className="text-white font-semibold mb-1">Location</h5>
              <p className="text-white/70 text-sm">Addis Ababa, Ethiopia</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-black" />
            </div>
            <div>
              <h5 className="text-white font-semibold mb-1">Email</h5>
              <a href="mailto:support@taxitera.com" className="text-white/70 hover:text-amber-400 transition-colors text-sm">
                support@taxitera.com
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-black" />
            </div>
            <div>
              <h5 className="text-white font-semibold mb-1">Available</h5>
              <p className="text-white/70 text-sm">24/7 Service</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <p className="text-white/60 text-sm">&copy; {currentYear} TaxiTera. All rights reserved.</p>
            <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full"></div>
            <p className="text-white/60 text-sm">Made with ❤️ in Ethiopia</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-white/60 hover:text-amber-400 transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-white/60 hover:text-amber-400 transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-white/60 hover:text-amber-400 transition-colors text-sm">
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}