"use client";

import { useBookingForm } from "@/hooks/useBookingForm";
import { api } from "@/lib/api";
import { showToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-text/80">{children}</label>;
}

export default function BookingForm() {
  const router = useRouter();
  const {
    values,
    update,
    incrementPassengers,
    decrementPassengers,
    swapStations,
    TAXI_TYPES,
    SAMPLE_STATIONS,
  } = useBookingForm();

  async function handleSubmit() {
    const payload = {
      route: `${values.pickupStation} -> ${values.destinationStation}`,
      type: values.taxiType,
      date: values.date,
      time: values.time,
      seatsBooked: values.passengers,
      passengerNames: [],
    };
    try {
      await api.post(`/bookings`, payload);
      showToast('Booking successful!', 'success');
    } catch (e: any) {
      if (String(e?.message || '').includes('401')) {
        showToast('Please sign in to book', 'error');
        router.push('/login');
        return;
      }
      showToast('Failed to book. Please try again.', 'error');
    }
  }

  return (
    <section id="book" className="w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Pickup station</Label>
              <div className="relative">
                <select
                  value={values.pickupStation}
                  onChange={(e) => update("pickupStation", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
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
                  className="absolute -right-3 -top-3 hidden md:inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-text shadow ring-1 ring-accent/40 transition hover:brightness-110"
                >
                  ⇅
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Destination station</Label>
              <select
                value={values.destinationStation}
                onChange={(e) => update("destinationStation", e.target.value)}
                className="w-full appearance-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              >
                {SAMPLE_STATIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Taxi type</Label>
              <select
                value={values.taxiType}
                onChange={(e) => update("taxiType", e.target.value as any)}
                className="w-full appearance-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              >
                {TAXI_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Date</Label>
              <input
                type="date"
                value={values.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Time</Label>
              <input
                type="time"
                value={values.time}
                onChange={(e) => update("time", e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-1">
              <Label>Passengers</Label>
              <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm">
                <button
                  type="button"
                  onClick={decrementPassengers}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-text ring-1 ring-accent/40 hover:bg-accent/20"
                >
                  −
                </button>
                <span className="min-w-8 text-center text-sm font-semibold">{values.passengers}</span>
                <button
                  type="button"
                  onClick={incrementPassengers}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-text ring-1 ring-accent/40 hover:bg-accent/20"
                >
                  +
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 flex items-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-white shadow-lg shadow-primary/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


