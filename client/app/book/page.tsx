"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import real map component to avoid SSR issues
const RealMap = dynamic(() => import('@/components/RealMap'), {
  ssr: false,
  loading: () => <div className="h-80 bg-white/10 rounded-xl flex items-center justify-center text-white/50">🗺️ Loading real map...</div>
});

const destinations = [
  "Piassa", "Arat Kilo", "Meskel Square", "Sidist Kilo", "Megenagna",
  "Mexico", "Jemo", "Ayat", "Sar Bet", "Mexico Square", "CMC",
  "Kazanchis", "Kirkos", "Gurd Sholla", "Saris", "Saris Bet",
  "Bole Bus Station", "Central Railway Station", "Addis Ababa Airport",
  "Merkato", "Lebu", "Bole-arabsa", "Tor Hayloch"
];

const calculatePrice = (from: string, to: string) => {
  const basePrice = 15;
  const airportSurcharge = (from.includes("Airport") || to.includes("Airport")) ? 50 : 0;
  const distance = Math.random() * 30 + 10; // Mock distance calculation
  return Math.round(basePrice + distance + airportSurcharge);
};

const vehicleTypes = [
  { id: "minibus", name: "Minibus", seats: 12, price: 1 },
  { id: "higer", name: "Higer", seats: 45, price: 1.2 },
  { id: "bus", name: "Bus", seats: 50, price: 0.8 },
];

export default function BookPage() {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuth();
  
  const [fromDestination, setFromDestination] = useState("");
  const [toDestination, setToDestination] = useState("");
  const [showMap, setShowMap] = useState(false);

  // Pre-fill form with quick booking data from landing page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const quickBookingData = localStorage.getItem('quickBookingData');
      if (quickBookingData) {
        try {
          const data = JSON.parse(quickBookingData);
          setFromDestination(data.pickupStation || "");
          setToDestination(data.destinationStation || "");
          setSelectedVehicle(data.taxiType || "");
          setSelectedDate(data.date || "");
          setSelectedTime(data.time || "");
          // Clear the stored data after using it
          localStorage.removeItem('quickBookingData');
        } catch (e) {
          console.error('Error parsing quick booking data:', e);
        }
      }
    }
  }, []);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengerNames, setPassengerNames] = useState<string[]>([]);

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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">Authentication Required</h2>
          <p className="text-white/70 mb-6">Please log in to book a ride</p>
          <button
            onClick={() => router.push('/login')}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-lg font-semibold text-black shadow-2xl shadow-amber-500/40 transition-all hover:shadow-amber-500/60 hover:scale-105"
          >
            Go to Login
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  const vehicle = vehicleTypes.find(v => v.id === selectedVehicle);
  const routePrice = fromDestination && toDestination ? calculatePrice(fromDestination, toDestination) : 0;
  const totalPrice = routePrice && vehicle ? routePrice * vehicle.price * selectedSeats.length : 0;
  const routeName = fromDestination && toDestination ? `${fromDestination} → ${toDestination}` : "";

  const handleSeatClick = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
      setPassengerNames(passengerNames.slice(0, -1));
    } else if (selectedSeats.length < 5) {
      setSelectedSeats([...selectedSeats, seatNumber]);
      setPassengerNames([...passengerNames, ""]);
    }
  };

  const updatePassengerName = (index: number, name: string) => {
    const newNames = [...passengerNames];
    newNames[index] = name;
    setPassengerNames(newNames);
  };

  const handleProceedToPayment = () => {
    if (!fromDestination || !toDestination || !selectedVehicle || !selectedDate || !selectedTime || selectedSeats.length === 0) {
      alert("Please fill all fields and select at least one seat");
      return;
    }

    if (passengerNames.some(name => !name.trim())) {
      alert("Please enter names for all passengers");
      return;
    }

    const bookingData = {
      route: routeName,
      vehicleType: selectedVehicle,
      date: selectedDate,
      time: selectedTime,
      seats: selectedSeats,
      passengerNames: passengerNames.filter(name => name.trim()),
      totalPrice
    };

    localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
    router.push('/payment');
  };

  const renderSeats = () => {
    if (!vehicle) return null;
    
    const seats = [];
    for (let i = 1; i <= vehicle.seats; i++) {
      const isSelected = selectedSeats.includes(i);
      const isOccupied = Math.random() > 0.7;
      
      seats.push(
        <button
          key={i}
          onClick={() => !isOccupied && handleSeatClick(i)}
          disabled={isOccupied}
          className={`
            w-10 h-10 m-1 rounded-xl text-sm font-medium transition-all
            ${isOccupied ? 'bg-red-400/20 text-red-300 cursor-not-allowed border border-red-400/30' : 
              isSelected ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg' : 
              'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40'}
          `}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
        {seats}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="absolute inset-0 -z-10">
        <img src="/addisababa.png" alt="Addis Ababa" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
      </div>

      <div className="relative px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 shadow-lg mb-6">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white">Book Your Journey</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Choose Your
              <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Perfect Ride
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Select your route, vehicle, and seats for a comfortable journey
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Booking Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white">Trip Details</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-white/80 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      From
                    </label>
                    <div className="relative">
                      <select 
                        value={fromDestination} 
                        onChange={(e) => setFromDestination(e.target.value)}
                        className="w-full p-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm hover:border-amber-400/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-gray-800 text-white">🚩 Select Origin</option>
                        {destinations.map(dest => (
                          <option key={dest} value={dest} className="bg-gray-800 text-white">
                            📍 {dest}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3 text-white/80 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      To
                    </label>
                    <div className="relative">
                      <select 
                        value={toDestination} 
                        onChange={(e) => setToDestination(e.target.value)}
                        className="w-full p-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm hover:border-green-400/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-gray-800 text-white">🎯 Select Destination</option>
                        {destinations.filter(dest => dest !== fromDestination).map(dest => (
                          <option key={dest} value={dest} className="bg-gray-800 text-white">
                            📍 {dest}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Map Toggle Button */}
                <div className="text-center">
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300 px-6 py-3 rounded-full hover:from-blue-500/30 hover:to-purple-500/30 transition-all shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    {showMap ? 'Hide Interactive Map' : 'Show Interactive Map'}
                  </button>
                </div>
                
                {showMap && (
                  <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">📍 Select Destinations on Map</h3>
                      <p className="text-white/60 text-sm">Click on map markers to select your pickup and destination points</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <RealMap 
                        onLocationSelect={(location) => {
                          if (!fromDestination) {
                            setFromDestination(location.name);
                          } else if (!toDestination && location.name !== fromDestination) {
                            setToDestination(location.name);
                          }
                        }}
                        fromLocation={fromDestination}
                        toLocation={toDestination}
                      />
                    </div>
                    {fromDestination && toDestination && (
                      <div className="mt-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/20 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium flex items-center gap-2">
                              <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                              {fromDestination}
                              <span className="text-white/50">→</span>
                              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                              {toDestination}
                            </p>
                            <p className="text-green-300 text-sm mt-1">💰 Estimated price: ${routePrice}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}


                <div>
                  <label className="block text-sm font-medium mb-3 text-white/80 flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    Vehicle Type
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedVehicle} 
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      className="w-full p-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm hover:border-amber-400/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-gray-800 text-white">🚌 Select Vehicle Type</option>
                      {vehicleTypes.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id} className="bg-gray-800 text-white">
                          🚐 {vehicle.name} ({vehicle.seats} seats)
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-white/80 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Travel Date
                    </label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm hover:border-blue-400/50 transition-all cursor-pointer"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3 text-white/80 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      Departure Time
                    </label>
                    <div className="relative">
                      <select 
                        value={selectedTime} 
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full p-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm hover:border-purple-400/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-gray-800 text-white">🕐 Select Time</option>
                        <option value="06:00" className="bg-gray-800 text-white">🌅 06:00 AM - Early Morning</option>
                        <option value="08:00" className="bg-gray-800 text-white">☀️ 08:00 AM - Morning Rush</option>
                        <option value="10:00" className="bg-gray-800 text-white">🌤️ 10:00 AM - Mid Morning</option>
                        <option value="12:00" className="bg-gray-800 text-white">☀️ 12:00 PM - Noon</option>
                        <option value="14:00" className="bg-gray-800 text-white">🌞 02:00 PM - Afternoon</option>
                        <option value="16:00" className="bg-gray-800 text-white">🌅 04:00 PM - Evening Rush</option>
                        <option value="18:00" className="bg-gray-800 text-white">🌆 06:00 PM - Evening</option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Seat Selection */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white">Select Seats</h2>
              </div>
              
              {vehicle ? (
                <div>
                  <div className="mb-6">
                    <div className="flex justify-center space-x-6 text-sm mb-6">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-white/10 border border-white/20 rounded mr-2"></div>
                        <span className="text-white/70">Available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded mr-2"></div>
                        <span className="text-white/70">Selected</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-400/20 border border-red-400/30 rounded mr-2"></div>
                        <span className="text-white/70">Occupied</span>
                      </div>
                    </div>
                    
                    {renderSeats()}
                  </div>

                  {selectedSeats.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-medium mb-4 text-white">Passenger Names</h3>
                      <div className="space-y-3">
                        {selectedSeats.map((seat, index) => (
                          <div key={seat}>
                            <input
                              type="text"
                              placeholder={`Passenger ${index + 1} (Seat ${seat})`}
                              value={passengerNames[index] || ""}
                              onChange={(e) => updatePassengerName(index, e.target.value)}
                              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/50">Select a vehicle to choose seats</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Summary & Payment */}
          {totalPrice > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Booking Summary</h3>
                  <div className="text-white/70 space-y-1">
                    <p><span className="text-amber-400">Route:</span> {routeName}</p>
                    <p><span className="text-amber-400">Vehicle:</span> {vehicle?.name}</p>
                    <p><span className="text-amber-400">Date:</span> {selectedDate}</p>
                    <p><span className="text-amber-400">Time:</span> {selectedTime}</p>
                    <p><span className="text-amber-400">Seats:</span> {selectedSeats.join(", ")}</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    ${totalPrice.toFixed(2)}
                  </div>
                  <button
                    onClick={handleProceedToPayment}
                    className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-lg font-semibold text-black shadow-2xl shadow-amber-500/40 transition-all hover:shadow-amber-500/60 hover:scale-105"
                  >
                    Proceed to Payment
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}