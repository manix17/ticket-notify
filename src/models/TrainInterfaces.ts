// src/models/TrainInterfaces.ts

import { AvailabilitySimple } from "./TrainDetails";

export interface TrainBetweenStations {
  trainBtwnStnsList: Train[];
  quotaList: string[];
  timeStamp: string;
  vikalpInSpecialTrainsAccomFlag: boolean;
  oneStopJourny: boolean;
  serveyFlag: boolean;
  alternateEnquiryFlag: boolean;
  errorMessage: string;
}

export interface Train {
  trainNumber: string;
  trainName: string;
  fromStnCode: string;
  toStnCode: string;
  arrivalTime: string;
  departureTime: string;
  distance: number;
  duration: string;
  runningDays: RunningDays;
  avlClasses: string[];
  trainType: string[];
  atasOpted: boolean;
  flexiFlag: boolean;
  trainOwner: string;
  trainsiteId: string;
  isCurrent: boolean; // Added by me to distinguish betweet current and previous days train
}

export interface TrainSimple {
  trainNumber: string;
  trainName: string;
  fromStnCode: string;
  toStnCode: string;
  avlClasses: string[];
  availabilityClass: AvailabilityClasses[]; // Added by me to store
  isCurrent: boolean; // Added by me to distinguish betweet current and previous days train
}

export interface AvailabilityClasses {
  classCode: string;
  availability: AvailabilitySimple[];
  errorMessage?: string; // Added by me
}

export interface RunningDays {
  Mon: boolean;
  Tue: boolean;
  Wed: boolean;
  Thu: boolean;
  Fri: boolean;
  Sat: boolean;
  Sun: boolean;
}
