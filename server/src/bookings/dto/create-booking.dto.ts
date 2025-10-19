import { IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  route: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(10)
  seatsBooked: number;

  @IsArray()
  @IsOptional()
  passengerNames?: string[];

  @IsOptional()
  price?: number;
}
