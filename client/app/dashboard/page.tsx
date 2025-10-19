"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import QRCode from "react-qr-code";

interface Booking {
  _id: string;
  route: string;
  type: string;
  date: string;
  time: string;
  seatsBooked: number;
  passengerNames: string[];
  price: number;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, clearSession, isAuthenticated, hydrated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingsLoaded, setBookingsLoaded] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  // Auto-load bookings when user is authenticated
  useEffect(() => {
    if (hydrated && isAuthenticated && !bookingsLoaded) {
      loadBookings();
    }
  }, [hydrated, isAuthenticated, bookingsLoaded]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  const loadBookings = async (forceRefresh = false) => {
    if (bookingsLoaded && !forceRefresh) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/bookings/me') as any;
      console.log('Loaded bookings:', data);
      setBookings(data.bookings || data || []);
      setBookingsLoaded(true);
    } catch (e: any) {
      console.error('Failed to load bookings:', e);
      setError('Failed to load bookings. You can still make new bookings.');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      await api.post(`/bookings/${id}/cancel`, { reason: "User requested cancellation" });
      await loadBookings(true); // Force refresh after cancellation
      showNotification("Booking cancelled successfully", "success");
    } catch (e: any) {
      showNotification("Failed to cancel booking: " + e.message, "error");
    }
  };

  const refreshBookings = () => {
    loadBookings(true);
    showNotification("Refreshing bookings...", "success");
  };

  // Calculate spending statistics
  const totalSpent = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
  const completedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
  const completedSpent = completedBookings.reduce((sum, b) => sum + (b.price || 0), 0);

  const showNotification = (message: string, type: "success" | "error") => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 5000);
  };

  function logout() {
    clearSession();
    router.replace('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="absolute inset-0 -z-10">
        <img src="/addisababa.png" alt="Addis Ababa" className="h-full w-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95" />
      </div>
      
      {/* Header */}
      <div className="relative bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 shadow-lg mb-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-sm font-medium text-white">Dashboard</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white/70">Hi, {user?.name}!</span>
              <button 
                onClick={() => router.push('/')}
                className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
              >
                🏠 Home
              </button>
              <button 
                onClick={logout} 
                className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-2 rounded-full hover:bg-red-500/30 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => router.push('/book')}
              className="group bg-gradient-to-r from-amber-400 to-orange-500 text-black p-8 rounded-3xl hover:scale-105 transition-all shadow-2xl shadow-amber-500/40 text-center"
            >
              <div className="text-4xl mb-4">🚌</div>
              <div className="font-bold text-xl mb-2">Book New Ride</div>
              <div className="text-sm opacity-80">Find and book your next trip</div>
            </button>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center shadow-xl">
              <div className="text-4xl mb-4">📊</div>
              <div className="font-semibold text-white/80 mb-2">Total Bookings</div>
              <div className="text-3xl font-bold text-white">{bookings.length}</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center shadow-xl">
              <div className="text-4xl mb-4">💰</div>
              <div className="font-semibold text-white/80 mb-2">Total Spent</div>
              <div className="text-3xl font-bold text-amber-400">
                ${totalSpent.toFixed(2)}
              </div>
              {completedSpent !== totalSpent && (
                <div className="text-xs text-white/50 mt-1">
                  Completed: ${completedSpent.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl">
          <div className="p-8 border-b border-white/20 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Your Bookings</h2>
            <div className="flex gap-3">
              {bookingsLoaded && (
                <button
                  onClick={refreshBookings}
                  disabled={loading}
                  className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  {loading ? '🔄' : '↻'} Refresh
                </button>
              )}
              {!bookingsLoaded && (
                <button
                  onClick={() => loadBookings()}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all shadow-lg"
                >
                  Load Bookings
                </button>
              )}
            </div>
          </div>
          
          <div className="p-8">
            {!bookingsLoaded ? (
              <div className="text-center py-12">
                <div className="text-white/30 text-6xl mb-6">📋</div>
                <h3 className="text-xl font-medium text-white mb-4">Ready to view your bookings?</h3>
                <p className="text-white/70 mb-6">Click "Load Bookings" to see your travel history</p>
                <button
                  onClick={() => loadBookings()}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all shadow-lg"
                >
                  Load Bookings
                </button>
              </div>
            ) : loading ? (
              <div className="text-center py-12 text-white">Loading bookings...</div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-300 mb-6">{error}</div>
                <button
                  onClick={() => router.push('/book')}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all shadow-lg"
                >
                  Book New Ride
                </button>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-white/30 text-6xl mb-6">🚌</div>
                <h3 className="text-xl font-medium text-white mb-4">No bookings yet</h3>
                <p className="text-white/70 mb-6">Start your journey by booking your first ride!</p>
                <button
                  onClick={() => router.push('/book')}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all shadow-lg"
                >
                  Book Now
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <h3 className="font-bold text-xl text-white">{booking.route}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                            booking.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                            'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6 text-sm text-white/70">
                          <div className="space-y-2">
                            <p><span className="text-amber-400 font-medium">Vehicle:</span> {booking.type}</p>
                            <p><span className="text-amber-400 font-medium">Date:</span> {booking.date}</p>
                            <p><span className="text-amber-400 font-medium">Time:</span> {booking.time}</p>
                          </div>
                          <div className="space-y-2">
                            <p><span className="text-amber-400 font-medium">Seats:</span> {booking.seatsBooked}</p>
                            <p><span className="text-amber-400 font-medium">Passengers:</span> {booking.passengerNames?.join(", ") || "N/A"}</p>
                            <p><span className="text-amber-400 font-medium">Price:</span> ${booking.price?.toFixed(2) || "0.00"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-3 ml-6">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-all"
                        >
                          View QR Code
                        </button>
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => cancelBooking(booking._id)}
                            className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-2 rounded-full text-sm hover:bg-red-500/30 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        <div className="text-xs text-white/50 text-center">
                          Booked: {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 shadow-lg mb-6">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-sm font-medium text-white">E-Ticket</span>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold text-xl text-white mb-2">{selectedBooking.route}</h3>
                <p className="text-white/70">{selectedBooking.date} at {selectedBooking.time}</p>
                <p className="text-white/70">Seats: {selectedBooking.seatsBooked}</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border-2 border-white/20 mb-6">
                <QRCode 
                  value={JSON.stringify({
                    bookingId: selectedBooking._id,
                    route: selectedBooking.route,
                    date: selectedBooking.date,
                    time: selectedBooking.time,
                    seats: selectedBooking.seatsBooked,
                    passenger: user?.name
                  })}
                  size={200}
                />
              </div>
              
              <p className="text-xs text-white/50 mb-6">
                Show this QR code to the driver when boarding
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 bg-white/10 border border-white/20 text-white py-3 rounded-full hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black py-3 rounded-full font-semibold hover:scale-105 transition-all"
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}