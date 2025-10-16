import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true })
  route: string; // e.g., "Megenagna - 4 Kilo"

  @Prop({ required: true })
  type: string; // minibus, higer, public, bus

  @Prop({ required: true })
  date: string; // ISO string or date

  @Prop({ required: true })
  time: string; // "08:30"

  @Prop({ required: true })
  seatsBooked: number;

  @Prop({ required: true })
  passengerNames: string[]; // names array

  @Prop()
  price: number;

  @Prop({ default: 'confirmed' })
  status: string; // confirmed, cancelled
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
