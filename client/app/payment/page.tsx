"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import QRCode from "react-qr-code";

export default function PaymentPage() {
  const router = useRouter();
  const { isAuthenticated, hydrated, user } = useAuth();
  const [bookingData, setBookingData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('pendingBooking');
      if (data) {
        setBookingData(JSON.parse(data));
      } else {
        router.push('/book');
      }
    }
  }, [router]);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold mb-4 text-white">Authentication Required</h2>
          <p className="text-white/70 mb-6">Please log in to complete payment</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!bookingData) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="text-white">Loading booking details...</div>
    </div>
  );

  // Show QR code after successful payment
  if (paymentComplete && createdBooking) {
    const qrData = {
      bookingId: createdBooking._id || createdBooking.data?._id,
      route: bookingData.route,
      date: bookingData.date,
      time: bookingData.time,
      seats: bookingData.seats,
      passenger: user?.name,
      price: bookingData.totalPrice
    };

    return (
      <div className="min-h-screen px-4 py-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 -z-10">
          <img src="/addisababa.png" alt="Addis Ababa" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
        </div>
        
        <div className="relative mx-auto max-w-2xl">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
            <div className="text-green-400 text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-green-400 mb-4">Payment Successful!</h1>
            <p className="text-white/70 mb-8">Your booking has been confirmed. Here's your e-ticket:</p>
            
            {/* Booking Details */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Trip Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
                <div><span className="text-amber-400 font-medium">Route:</span> {bookingData.route}</div>
                <div><span className="text-amber-400 font-medium">Date:</span> {bookingData.date}</div>
                <div><span className="text-amber-400 font-medium">Time:</span> {bookingData.time}</div>
                <div><span className="text-amber-400 font-medium">Vehicle:</span> {bookingData.vehicleType}</div>
                <div><span className="text-amber-400 font-medium">Seats:</span> {bookingData.seats.join(", ")}</div>
                <div><span className="text-amber-400 font-medium">Price:</span> ${bookingData.totalPrice.toFixed(2)}</div>
              </div>
              <div className="mt-4">
                <span className="text-amber-400 font-medium">Passengers:</span>
                <ul className="text-sm mt-2 text-white/70">
                  {bookingData.passengerNames.map((name: string, index: number) => (
                    <li key={index}>• {name} (Seat {bookingData.seats[index]})</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-6">
              <h3 className="font-semibold mb-4">Your E-Ticket QR Code</h3>
              <div className="flex justify-center">
                <QRCode 
                  value={JSON.stringify(qrData)}
                  size={200}
                  className="border-4 border-white"
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Show this QR code to the driver when boarding
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.print()}
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all"
              >
                Print Ticket
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push('/book')}
                className="bg-green-500/20 border border-green-400/30 text-green-300 px-6 py-3 rounded-full hover:bg-green-500/30 transition-colors"
              >
                Book Another Ride
              </button>
            </div>

            <div className="mt-8 text-sm text-white/50">
              <p>Booking ID: {createdBooking._id || createdBooking.data?._id}</p>
              <p>Keep this QR code safe for your journey!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      // Quick payment processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create booking with correct API format
      const booking = await api.post('/bookings', {
        route: bookingData.route,
        type: bookingData.vehicleType,
        date: bookingData.date,
        time: bookingData.time,
        seatsBooked: bookingData.seats.length,
        passengerNames: bookingData.passengerNames,
        price: bookingData.totalPrice
      });

      console.log('Booking created:', booking);
      setCreatedBooking(booking);
      setPaymentComplete(true);

      // Clear pending booking
      localStorage.removeItem('pendingBooking');
      
      // Show success notification
      showNotification("Payment successful! Your booking has been confirmed.", "success");
      
    } catch (error: any) {
      console.error('Booking failed:', error);
      showNotification("Booking failed: " + (error.message || "Please try again"), "error");
    } finally {
      setProcessing(false);
    }
  };

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

  return (
    <div className="min-h-screen px-4 py-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="absolute inset-0 -z-10">
        <img src="/addisababa.png" alt="Addis Ababa" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
      </div>
      
      <div className="relative mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 shadow-lg mb-4">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-sm font-medium text-white">Secure Payment</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Complete Your
            <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Payment
            </span>
          </h1>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Booking Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-white/70">
                <span>Route:</span>
                <span className="font-medium text-white">{bookingData.route}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Vehicle:</span>
                <span className="font-medium text-white">{bookingData.vehicleType}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Date:</span>
                <span className="font-medium text-white">{bookingData.date}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Time:</span>
                <span className="font-medium text-white">{bookingData.time}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Seats:</span>
                <span className="font-medium text-white">{bookingData.seats.join(", ")}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Passengers:</span>
                <span className="font-medium text-white">{bookingData.passengerNames.length}</span>
              </div>
              <hr className="border-white/20" />
              <div className="flex justify-between text-2xl font-bold text-amber-400">
                <span>Total:</span>
                <span>${bookingData.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-3 text-white">Passengers:</h3>
              <ul className="text-sm space-y-2 text-white/70">
                {bookingData.passengerNames.map((name: string, index: number) => (
                  <li key={index}>• {name} (Seat {bookingData.seats[index]})</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Payment Details</h2>
            
            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-white/80">Payment Method</label>
              <div className="space-y-3">
                <label className="flex items-center text-white/70 cursor-pointer">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 accent-amber-400"
                  />
                  Credit/Debit Card
                </label>
                <label className="flex items-center text-white/70 cursor-pointer">
                  <input
                    type="radio"
                    value="mobile"
                    checked={paymentMethod === "mobile"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 accent-amber-400"
                  />
                  Mobile Money
                </label>
              </div>
            </div>

            {/* Card Payment Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Card Number (1234 5678 9012 3456)"
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm"
                />
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm"
                  />
                </div>
              </div>
            )}

            {/* Mobile Money */}
            {paymentMethod === "mobile" && (
              <div className="space-y-4">
                <input
                  type="tel"
                  placeholder="Mobile Number (+251 9XX XXX XXX)"
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm"
                />
                <div className="bg-amber-500/20 border border-amber-400/30 p-4 rounded-2xl">
                  <p className="text-sm text-amber-300">
                    You will receive an SMS with payment instructions.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={processing}
              className={`w-full mt-8 py-4 px-8 rounded-full font-semibold text-lg transition-all ${
                processing 
                  ? 'bg-gray-500/20 border border-gray-400/30 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 hover:scale-105'
              }`}
            >
              {processing ? 'Processing Payment...' : `Pay $${bookingData.totalPrice.toFixed(2)}`}
            </button>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.back()}
                className="text-white/70 hover:text-white transition-colors"
              >
                ← Back to Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}