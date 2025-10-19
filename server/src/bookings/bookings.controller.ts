import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req: any, @Body() createDto: CreateBookingDto) {
    const userId = req.user.userId;
    const userEmail = req.user.email;
    return this.bookingsService.create({ ...createDto, user: userId } as any, userEmail);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: any) {
    return this.bookingsService.findByUser(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.bookingsService.cancel(id);
  }
}