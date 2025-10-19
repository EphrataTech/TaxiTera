export type TaxiType = "minibus" | "higer" | "public-bus" | "taxi";

export interface BookingFormValues {
  pickupStation: string;
  destinationStation: string;
  taxiType: TaxiType;
  date: string; // yyyy-mm-dd
  time: string; // HH:MM
  passengers: number;
}


