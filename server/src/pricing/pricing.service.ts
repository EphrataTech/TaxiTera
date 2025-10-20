import { Injectable } from '@nestjs/common';

@Injectable()
export class PricingService {
  private readonly distances = {
    'Piassa-Arat Kilo': 3,
    'Piassa-Meskel Square': 5,
    'Arat Kilo-Sidist Kilo': 4,
    'Meskel Square-Megenagna': 8,
    'Mexico-Jemo': 12,
    'Ayat-Sar Bet': 15,
    'CMC-Kazanchis': 6,
    'Kirkos-Gurd Sholla': 7,
    'Saris-Bole Bus Station': 10,
    'Central Railway Station-Merkato': 4,
    'Addis Ababa Airport-Bole': 8,
    'Lebu-Bole-arabsa': 18,
    'Tor Hayloch-Mexico Square': 20,
    'Piassa-Airport': 25,
    'Merkato-Airport': 22,
    'Mexico-Airport': 15,
    'Ayat-Piassa': 20,
    'Jemo-Kazanchis': 25,
  };

  private readonly vehicleTypes = [
    { id: 'minibus', name: 'Minibus', seats: 12, multiplier: 1.0, description: 'Standard comfort' },
    { id: 'higer', name: 'Higer', seats: 45, multiplier: 0.8, description: 'Economy option' },
    { id: 'bus', name: 'Bus', seats: 50, multiplier: 0.7, description: 'Budget friendly' },
  ];

  calculatePrice(from: string, to: string, vehicleType: string, passengers: number = 1) {
    const distance = this.getDistance(from, to);
    const vehicle = this.vehicleTypes.find(v => v.id === vehicleType);
    
    if (!vehicle) {
      throw new Error('Invalid vehicle type');
    }

    const basePrice = 10;
    const pricePerKm = 2.5;
    const airportSurcharge = (from.includes('Airport') || to.includes('Airport')) ? 30 : 0;
    
    const routePrice = Math.round((basePrice + (distance * pricePerKm) + airportSurcharge) * vehicle.multiplier);
    const totalPrice = Math.max(routePrice, 15) * passengers;

    return {
      from,
      to,
      vehicleType: vehicle.name,
      distance,
      pricePerPerson: Math.max(routePrice, 15),
      totalPrice,
      passengers,
      breakdown: {
        basePrice,
        distancePrice: distance * pricePerKm,
        airportSurcharge,
        vehicleMultiplier: vehicle.multiplier,
      }
    };
  }

  private getDistance(from: string, to: string): number {
    const key1 = `${from}-${to}`;
    const key2 = `${to}-${from}`;
    
    if (this.distances[key1]) return this.distances[key1];
    if (this.distances[key2]) return this.distances[key2];
    
    return Math.floor(Math.random() * 15) + 8;
  }

  getPopularRoutes() {
    return [
      { from: 'Piassa', to: 'Meskel Square', price: 22 },
      { from: 'Mexico', to: 'Addis Ababa Airport', price: 67 },
      { from: 'Merkato', to: 'Bole', price: 35 },
      { from: 'Arat Kilo', to: 'Megenagna', price: 28 },
    ];
  }

  getVehicleTypes() {
    return this.vehicleTypes;
  }
}