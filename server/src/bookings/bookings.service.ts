import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>) {}

  async create(createDto: CreateBookingDto) {
    const created = new this.bookingModel(createDto);
    return created.save();
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
}
