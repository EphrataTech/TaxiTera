export class CreateBookingDto {
  user: string;
  route: string;
  type: string;
  date: string;
  time: string;
  seatsBooked: number;
  passengerNames: string[];
  price?: number;
}
