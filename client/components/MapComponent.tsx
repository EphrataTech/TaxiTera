"use client";

import { useState } from 'react';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface MapComponentProps {
  onLocationSelect: (location: Location) => void;
  fromLocation?: string;
  toLocation?: string;
}

// Ethiopian destinations with coordinates
const destinations: Location[] = [
  { name: "Piassa", lat: 9.0320, lng: 38.7469 },
  { name: "Arat Kilo", lat: 9.0365, lng: 38.7635 },
  { name: "Meskel Square", lat: 9.0120, lng: 38.7634 },
  { name: "Sidist Kilo", lat: 9.0410, lng: 38.7580 },
  { name: "Megenagna", lat: 8.9806, lng: 38.7578 },
  { name: "Mexico", lat: 9.0157, lng: 38.7614 },
  { name: "Jemo", lat: 8.9500, lng: 38.7200 },
  { name: "Ayat", lat: 8.9200, lng: 38.7800 },
  { name: "Sar Bet", lat: 9.0500, lng: 38.7400 },
  { name: "Mexico Square", lat: 9.0180, lng: 38.7600 },
  { name: "CMC", lat: 9.0050, lng: 38.7450 },
  { name: "Kazanchis", lat: 9.0280, lng: 38.7520 },
  { name: "Kirkos", lat: 9.0100, lng: 38.7300 },
  { name: "Gurd Sholla", lat: 8.9800, lng: 38.7100 },
  { name: "Saris", lat: 9.0600, lng: 38.7700 },
  { name: "Saris Bet", lat: 9.0650, lng: 38.7750 },
  { name: "Bole Bus Station", lat: 8.9950, lng: 38.7850 },
  { name: "Central Railway Station", lat: 9.0300, lng: 38.7400 },
  { name: "Addis Ababa Airport", lat: 8.9806, lng: 38.7992 },
  { name: "Merkato", lat: 9.0157, lng: 38.7251 },
  { name: "Lebu", lat: 8.9400, lng: 38.6800 },
  { name: "Bole-arabsa", lat: 8.9900, lng: 38.8000 },
  { name: "Tor Hayloch", lat: 9.0800, lng: 38.8200 }
];

export default function MapComponent({ onLocationSelect, fromLocation, toLocation }: MapComponentProps) {
  const [selectedDest, setSelectedDest] = useState<string | null>(null);

  const handleLocationClick = (dest: Location) => {
    setSelectedDest(dest.name);
    onLocationSelect(dest);
  };

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="h-64 w-full rounded-xl overflow-hidden border border-white/20 bg-gradient-to-br from-blue-900/20 to-green-900/20 relative">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Simple road network */}
              <path d="M50 150 L350 150" stroke="#4a5568" strokeWidth="3" />
              <path d="M200 50 L200 250" stroke="#4a5568" strokeWidth="3" />
              <path d="M100 100 L300 200" stroke="#4a5568" strokeWidth="2" />
              <path d="M300 100 L100 200" stroke="#4a5568" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Location Markers */}
        <div className="absolute inset-0 p-4">
          {destinations.map((dest, index) => {
            const isFrom = dest.name === fromLocation;
            const isTo = dest.name === toLocation;
            const isSelected = dest.name === selectedDest;
            
            // Position markers in a grid-like pattern
            const x = (index % 6) * 60 + 20;
            const y = Math.floor(index / 6) * 50 + 20;
            
            return (
              <button
                key={dest.name}
                onClick={() => handleLocationClick(dest)}
                className={`absolute w-6 h-6 rounded-full border-2 border-white transition-all hover:scale-125 ${
                  isFrom ? 'bg-green-500 shadow-lg shadow-green-500/50' :
                  isTo ? 'bg-amber-500 shadow-lg shadow-amber-500/50' :
                  isSelected ? 'bg-blue-500 shadow-lg shadow-blue-500/50' :
                  'bg-gray-400 hover:bg-blue-400'
                }`}
                style={{ left: `${x}px`, top: `${y}px` }}
                title={dest.name}
              >
                <span className="sr-only">{dest.name}</span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Origin</span>
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span>Destination</span>
          </div>
        </div>
      </div>

      {/* Location List */}
      <div className="mt-4 max-h-32 overflow-y-auto bg-white/5 rounded-xl p-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {destinations.map((dest) => {
            const isFrom = dest.name === fromLocation;
            const isTo = dest.name === toLocation;
            
            return (
              <button
                key={dest.name}
                onClick={() => handleLocationClick(dest)}
                className={`text-left p-2 rounded-lg transition-colors ${
                  isFrom ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                  isTo ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                  'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {dest.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}