"use client";

import { useAuth } from "@/context/AuthContext";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Pricing from "@/components/Pricing";
import FAQSection from "@/components/FAQSection";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";

export default function HomePage() {
  const { isAuthenticated, hydrated } = useAuth();

  if (!hydrated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <AboutSection />
      <HowItWorksSection />
      <ServicesSection />
      <Pricing />
      <TestimonialsSection />
      <FAQSection />
      
      {/* Booking Section - only show for authenticated users */}
      {isAuthenticated && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              
            </div>
            <BookingForm />
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
}