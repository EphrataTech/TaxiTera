"use client";

import { useEffect, useRef } from 'react';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface GoogleMapProps {
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
    google: any;
    initMap: () => void;
    selectMapLocation: (name: string, lat: number, lng: number) => void;
  }
}

export default function GoogleMap({ onLocationSelect, fromLocation, toLocation }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', initializeMap);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 9.0320, lng: 38.7469 }, // Addis Ababa center
        zoom: 12,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ color: "#1a1d29" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#0f172a" }]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#374151" }]
          },
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      // Add markers for all destinations
      destinations.forEach((dest) => {
        const isFrom = dest.name === fromLocation;
        const isTo = dest.name === toLocation;
        
        const marker = new window.google.maps.Marker({
          position: { lat: dest.lat, lng: dest.lng },
          map: map,
          title: dest.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: isFrom ? '#10b981' : isTo ? '#f59e0b' : '#3b82f6',
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; text-align: center;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937;">${dest.name}</h3>
              <button 
                onclick="window.selectMapLocation('${dest.name}', ${dest.lat}, ${dest.lng})"
                style="
                  background: linear-gradient(to right, #fbbf24, #f59e0b);
                  color: black;
                  border: none;
                  padding: 6px 12px;
                  border-radius: 16px;
                  font-weight: 600;
                  cursor: pointer;
                "
              >
                Select Location
              </button>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      mapInstanceRef.current = map;
    };

    // Global function for info window buttons
    window.selectMapLocation = (name: string, lat: number, lng: number) => {
      onLocationSelect({ name, lat, lng });
    };

    loadGoogleMaps();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [onLocationSelect, fromLocation, toLocation]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="h-80 w-full rounded-xl overflow-hidden border border-white/20"
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