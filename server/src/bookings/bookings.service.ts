import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../auth/email.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private notificationsService: NotificationsService,
    private emailService: EmailService,
  ) {}

  async create(createDto: CreateBookingDto, userEmail?: string) {
    const created = new this.bookingModel(createDto);
    const saved = await created.save();
    
    if (userEmail) {
      await this.notificationsService.sendBookingConfirmation(userEmail, saved);
      
      // Send payment confirmation email
      try {
        await this.emailService.sendPaymentConfirmationEmail(userEmail, {
          route: saved.route,
          date: saved.date,
          time: saved.time,
          vehicleType: saved.type,
          seats: saved.seatsBooked,
          passengerNames: saved.passengerNames,
          totalPrice: saved.price,
          bookingId: saved._id
        });
      } catch (error) {
        console.error('Failed to send payment confirmation email:', error);
      }
    }
    
    return saved;
  }

  async findAll() {
    return this.bookingModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByUser(userId: string) {
    return this.bookingModel.find({ user: userId }).exec();
  }

  async cancel(id: string) {
    const b = await this.bookingModel.findById(id);
    if (!b) throw new NotFoundException('Booking not found');
    b.status = 'cancelled';
    return b.save();
  }

  async update(id: string, updateData: { date: string; time: string; additionalFee: number }) {
    const booking = await this.bookingModel.findById(id);
    if (!booking) throw new NotFoundException('Booking not found');
    
    booking.date = updateData.date;
    booking.time = updateData.time;
    booking.price = booking.price + updateData.additionalFee;
    
    return booking.save();
  }
}