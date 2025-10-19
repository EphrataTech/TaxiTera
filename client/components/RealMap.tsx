"use client";

import { useEffect, useRef } from 'react';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface RealMapProps {
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

declare global {
  interface Window {
    L: any;
    selectRealMapLocation: (name: string, lat: number, lng: number) => void;
  }
}

export default function RealMap({ onLocationSelect, fromLocation, toLocation }: RealMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadLeaflet = async () => {
      // Load CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

      // Load JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        
        await new Promise((resolve) => {
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      initializeMap();
    };

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current || !window.L) return;

      // Initialize map centered on Addis Ababa
      const map = window.L.map(mapRef.current).setView([9.0320, 38.7469], 12);

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Add markers for all destinations
      destinations.forEach((dest) => {
        const isFrom = dest.name === fromLocation;
        const isTo = dest.name === toLocation;
        
        let iconColor = '#3b82f6'; // Default blue
        if (isFrom) iconColor = '#10b981'; // Green for origin
        if (isTo) iconColor = '#f59e0b'; // Amber for destination

        const marker = window.L.circleMarker([dest.lat, dest.lng], {
          radius: 10,
          fillColor: iconColor,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map);

        const popupContent = `
          <div style="text-align: center; padding: 8px; min-width: 140px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${dest.name}</h3>
            <button 
              onclick="window.selectRealMapLocation('${dest.name}', ${dest.lat}, ${dest.lng})"
              style="
                background: linear-gradient(to right, #fbbf24, #f59e0b);
                color: black;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
                transition: transform 0.2s;
              "
              onmouseover="this.style.transform='scale(1.05)'"
              onmouseout="this.style.transform='scale(1)'"
            >
              Select Location
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
      });

      mapInstanceRef.current = map;
    };

    // Global function for popup buttons
    window.selectRealMapLocation = (name: string, lat: number, lng: number) => {
      onLocationSelect({ name, lat, lng });
      if (mapInstanceRef.current) {
        mapInstanceRef.current.closePopup();
      }
    };

    loadLeaflet();

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
        className="h-80 w-full rounded-xl overflow-hidden border border-white/20 shadow-lg"
        style={{ zIndex: 1 }}
      />
      <div className="absolute top-3 left-3 bg-black/80 text-white text-xs px-3 py-2 rounded-lg z-10 backdrop-blur-sm">
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
      <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-3 py-2 rounded-lg z-10 backdrop-blur-sm">
        <span>Click markers to select locations</span>
      </div>
    </div>
  );
}