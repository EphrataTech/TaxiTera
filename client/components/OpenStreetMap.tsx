"use client";

import { useEffect, useRef } from 'react';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface OpenStreetMapProps {
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

export default function OpenStreetMap({ onLocationSelect, fromLocation, toLocation }: OpenStreetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Initialize map centered on Addis Ababa
      const map = L.map(mapRef.current).setView([9.0320, 38.7469], 12);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add markers for all destinations
      destinations.forEach((dest) => {
        const isFrom = dest.name === fromLocation;
        const isTo = dest.name === toDestination;
        
        let iconColor = '#3b82f6'; // Default blue
        if (isFrom) iconColor = '#10b981'; // Green for origin
        if (isTo) iconColor = '#f59e0b'; // Amber for destination

        const marker = L.circleMarker([dest.lat, dest.lng], {
          radius: 8,
          fillColor: iconColor,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map);

        marker.bindPopup(`
          <div style="text-align: center; padding: 8px; min-width: 120px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${dest.name}</h3>
            <button 
              onclick="window.selectOSMLocation('${dest.name}', ${dest.lat}, ${dest.lng})"
              style="
                background: linear-gradient(to right, #fbbf24, #f59e0b);
                color: black;
                border: none;
                padding: 6px 12px;
                border-radius: 16px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
              "
            >
              Select Location
            </button>
          </div>
        `);
      });

      mapInstanceRef.current = map;
    });

    // Global function for popup buttons
    (window as any).selectOSMLocation = (name: string, lat: number, lng: number) => {
      onLocationSelect({ name, lat, lng });
      if (mapInstanceRef.current) {
        mapInstanceRef.current.closePopup();
      }
    };

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onLocationSelect, fromLocation, toLocation]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="h-80 w-full rounded-xl overflow-hidden border border-white/20"
        style={{ zIndex: 1 }}
      />
      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-3 py-2 rounded-lg z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Origin</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span>Destination</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}