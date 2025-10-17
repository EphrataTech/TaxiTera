"use client";

import { useMemo, useState } from "react";
import type { BookingFormValues, TaxiType } from "@/types/booking";
import { SAMPLE_STATIONS, TAXI_TYPES } from "@/lib/constants";

function getTodayDate(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getNextHour(): string {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 1);
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function useBookingForm() {
  const [values, setValues] = useState<BookingFormValues>({
    pickupStation: SAMPLE_STATIONS[0],
    destinationStation: SAMPLE_STATIONS[1],
    taxiType: TAXI_TYPES[0].value as TaxiType,
    date: getTodayDate(),
    time: getNextHour(),
    passengers: 1,
  });

  const canSwap = useMemo(
    () => values.pickupStation !== values.destinationStation,
    [values.pickupStation, values.destinationStation]
  );

  function update<K extends keyof BookingFormValues>(key: K, value: BookingFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function incrementPassengers() {
    setValues((prev) => ({ ...prev, passengers: Math.min(prev.passengers + 1, 10) }));
  }

  function decrementPassengers() {
    setValues((prev) => ({ ...prev, passengers: Math.max(prev.passengers - 1, 1) }));
  }

  function swapStations() {
    setValues((prev) => ({
      ...prev,
      pickupStation: prev.destinationStation,
      destinationStation: prev.pickupStation,
    }));
  }

  return {
    values,
    update,
    incrementPassengers,
    decrementPassengers,
    swapStations,
    canSwap,
    TAXI_TYPES,
    SAMPLE_STATIONS,
  } as const;
}


