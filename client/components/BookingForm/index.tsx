"use client";

import { useBookingForm } from "@/hooks/useBookingForm";
import { api } from "@/lib/api";
import { showToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, Users, ArrowRight, RefreshCw } from "lucide-react";

function Label({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-card-foreground/80 mb-2">
      {Icon && <Icon className="w-4 h-4 text-amber-400" />}
      {children}
    </label>
  );
}

export default function BookingForm() {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuth();
  const {
    values,
    update,
    incrementPassengers,
    decrementPassengers,
    swapStations,
    TAXI_TYPES,
    SAMPLE_STATIONS,
  } = useBookingForm();

  function handleSubmit() {
    if (!hydrated) return;
    if (!isAuthenticated) {
      showToast('Please sign in to book a ride', 'error');
      router.push('/login');
      return;
    }
    
    // Store form data and redirect to proper booking flow
    const formData = {
      pickupStation: values.pickupStation,
      destinationStation: values.destinationStation,
      taxiType: values.taxiType,
      date: values.date,
      time: values.time,
      passengers: values.passengers
    };
    
    localStorage.setItem('quickBookingData', JSON.stringify(formData));
    router.push('/book');
  }

  return (
    <section id="book" className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Book Your{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Ride
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick and easy booking for your next journey in Addis Ababa
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative rounded-2xl bg-card shadow-2xl ring-1 ring-black/5 p-6 sm:p-8 md:p-10"
        >
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-2">
              <Label icon={MapPin}>Pickup Location</Label>
              <div className="relative">
                <select
                  value={values.pickupStation}
                  onChange={(e) => update("pickupStation", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-black/10 bg-card px-4 py-3 text-sm text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 transition-all duration-200"
                >
                  {SAMPLE_STATIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={swapStations}
                  aria-label="Swap stations"
                  className="absolute -right-3 -top-3 hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <Label icon={MapPin}>Destination</Label>
              <select
                value={values.destinationStation}
                onChange={(e) => update("destinationStation", e.target.value)}
                className="w-full appearance-none rounded-xl border border-black/10 bg-card px-4 py-3 text-sm text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 transition-all duration-200"
              >
                {SAMPLE_STATIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Vehicle Type</Label>
              <select
                value={values.taxiType}
                onChange={(e) => update("taxiType", e.target.value as any)}
                className="w-full appearance-none rounded-xl border border-black/10 bg-card px-4 py-3 text-sm text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 transition-all duration-200"
              >
                {TAXI_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label icon={Calendar}>Date</Label>
              <input
                type="date"
                value={values.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-card px-4 py-3 text-sm text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 transition-all duration-200"
              />
            </div>

            <div>
              <Label icon={Clock}>Time</Label>
              <input
                type="time"
                value={values.time}
                onChange={(e) => update("time", e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-card px-4 py-3 text-sm text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 transition-all duration-200"
              />
            </div>

            <div className="lg:col-span-2">
              <Label icon={Users}>Passengers</Label>
              <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-card px-4 py-3 shadow-sm">
                <button
                  type="button"
                  onClick={decrementPassengers}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/10 text-card-foreground hover:bg-amber-400/20 transition-all duration-200 font-semibold"
                >
                  −
                </button>
                <span className="min-w-12 text-center text-lg font-bold text-card-foreground">{values.passengers}</span>
                <button
                  type="button"
                  onClick={incrementPassengers}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/10 text-card-foreground hover:bg-amber-400/20 transition-all duration-200 font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 pt-4">
              <motion.button
                type="button"
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-lg font-semibold text-black shadow-2xl shadow-amber-500/40 transition-all hover:shadow-amber-500/60 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Continue Booking
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
