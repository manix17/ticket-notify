// src/models/TrainDetails.ts

export interface TrainDetails {
  trainName: string;
  errorMessage: string;
  distance: string;
  reqEnqParam: string;
  quota: string;
  enqClass: string;
  from: string;
  to: string;
  trainNo: string;
  baseFare: string;
  reservationCharge: string;
  superfastCharge: string;
  fuelAmount: string;
  totalConcession: string;
  tatkalFare: string;
  serviceTax: string;
  otherCharge: string;
  cateringCharge: string;
  dynamicFare: string;
  totalFare: string;
  travelInsuranceCharge: string;
  travelInsuranceServiceTax: string;
  insuredPsgnCount: string;
  nextEnqDate: string;
  timeStamp: string;
  otpAuthenticationFlag: string;
  cateringFlag: string;
  totalCollectibleAmount: string;
  avlDayList: Availability[];
  informationMessage: InformationMessage[];
  reTry: string;
  altAvlEnabled: string;
  altTrainEnabled: string;
  altClsEnabled: string;
  taRdsFlag: string;
  upiRdsFlag: string;
  rdsTxnPwdFlag: string;
  ftBookingMsgFlag: string;
  lastUpdateTime: string;
}

export interface TrainDetailsSimple {
  trainName: string;
  errorMessage: string;
  totalFare: string;
  avlDayList: AvailabilitySimple[];
  lastUpdateTime: string;
}

export interface Availability {
  availablityDate: string;
  availablityStatus: string;
  reasonType: string;
  availablityType: string;
  currentBkgFlag: string;
  wlType: string;
  delayFlag: string;
  delay: string;
}

export interface AvailabilitySimple {
  availablityDate: string;
  availablityStatus: string;
  reasonType: string;
  availablityType: string;
  wlType: string;
}

export interface InformationMessage {
  message: string;
  popup: string;
  paramName: string;
}
