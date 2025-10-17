"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Booking {
  _id: string;
  route: string;
  type: string;
  date: string;
  time: string;
  seatsBooked: number;
  status?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('tt_user') || 'null') : null;

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    (async () => {
      try {
        const data = await api.get(`/bookings/me`);
        setBookings(data || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function cancelBooking(id: string) {
    try {
      await api.post(`/bookings/${id}/cancel`, {});
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b)));
    } catch (e) {
      // noop minimal error handling
    }
  }

  function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tt_access_token');
      localStorage.removeItem('tt_user');
      document.cookie = 'tt_access_token=; Path=/; Max-Age=0';
    }
    router.replace('/');
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Your bookings</h1>
          <button onClick={logout} className="rounded-full bg-accent/10 px-4 py-2 text-sm ring-1 ring-accent/40 hover:bg-accent/20">Logout</button>
        </div>

        {loading ? (
          <p className="mt-6 text-text/70">Loading...</p>
        ) : error ? (
          <p className="mt-6 text-red-600">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="mt-6 text-text/70">No bookings yet.</p>
        ) : (
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((b) => (
              <li key={b._id} className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs rounded-full bg-accent/10 px-2 py-1 ring-1 ring-accent/40">{b.type}</span>
                  <span className="text-xs text-text/60">{b.status || 'active'}</span>
                </div>
                <h3 className="mt-2 font-semibold text-text">{b.route}</h3>
                <p className="text-sm text-text/70">{b.date} at {b.time}</p>
                <p className="text-sm text-text/70">Passengers: {b.seatsBooked}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => cancelBooking(b._id)} className="rounded-lg bg-red-50 px-3 py-2 text-red-700 ring-1 ring-red-200 text-sm">Cancel</button>
                  <button onClick={() => setTicketId(b._id)} className="rounded-lg bg-primary px-3 py-2 text-white text-sm shadow shadow-primary/30">View e-ticket</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {ticketId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setTicketId(null)}>
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-text">E-Ticket</h2>
              <p className="mt-2 text-sm text-text/70">Booking ID: {ticketId}</p>
              <p className="mt-1 text-sm text-text/70">Show this at the station.</p>
              <div className="mt-4 flex justify-end">
                <button onClick={() => setTicketId(null)} className="rounded-lg bg-accent/10 px-4 py-2 text-sm ring-1 ring-accent/40">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


