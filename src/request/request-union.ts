import { createUnionType } from '@nestjs/graphql';
import {
  FlightBookingType,
  VisaRequestType,
  PrivateJetRequest,
  HotelReservation,
  TourPackageRequest,
  ExecutiveShuttleRequest,
  TravelInsurance,
  SehembzPayRequest,
  RequestType,
} from '../dtos/request.dto';

export const RequestUnion = createUnionType({
  name: 'RequestUnion',
  types: () => [
    FlightBookingType,
    VisaRequestType,
    PrivateJetRequest,
    HotelReservation,
    TourPackageRequest,
    ExecutiveShuttleRequest,
    TravelInsurance,
    SehembzPayRequest,
  ] as const,
  resolveType(value) {
    switch (value.requestType) {
      case RequestType.FLIGHT_BOOKING:
        return FlightBookingType;
      case RequestType.VISA_ASSISTANCE:
        return VisaRequestType;
      case RequestType.PRIVATE_JET_CHARTER:
        return PrivateJetRequest;
      case RequestType.HOTEL_RESERVATION:
        return HotelReservation;
      case RequestType.TOUR_PACKAGE:
        return TourPackageRequest;
      case RequestType.EXECUTIVE_SHUTTLE:
        return ExecutiveShuttleRequest;
      case RequestType.TRAVEL_INSURANCE:
        return TravelInsurance;
      case RequestType.SEHEMBZ_PAY:
        return SehembzPayRequest;
      default:
        return null;
    }
  },
});
