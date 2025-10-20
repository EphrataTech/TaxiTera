import { Controller, Get, Query } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('calculate')
  calculatePrice(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('vehicleType') vehicleType: string,
    @Query('passengers') passengers: number = 1,
  ) {
    return this.pricingService.calculatePrice(from, to, vehicleType, passengers);
  }

  @Get('routes')
  getPopularRoutes() {
    return this.pricingService.getPopularRoutes();
  }

  @Get('vehicles')
  getVehicleTypes() {
    return this.pricingService.getVehicleTypes();
  }
}