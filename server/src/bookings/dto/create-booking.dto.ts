import { IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max, Min, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @Transform(({ value }) => value?.trim())
  route: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  @Transform(({ value }) => value?.trim())
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