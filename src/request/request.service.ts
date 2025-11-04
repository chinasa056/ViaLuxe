import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateFlightBookingInput,
  FlightBookingResponse,
  VisaRequestInput,
  VisaRequestResponse,
  RequestPrivateJetInput,
  RequestPrivatejetResponse,
  RequestHotelreservtion,
  HotelReservationResponse,
  RequestTourPackage,
  requestTourPackageResponse,
  RequestExexutiveShuttleInput,
  RequestExexutiveShuttleResponse,
  RequestTravelInsurance,
  TravelInsuranceResponse,
  RequestSehembzPay,
  RequestSehembzPayResponse,
  RequestFilterInput,
  PaginatedRequests,
  RequestStatus,
  RequestType,
  BaseRequestType,
  FlightBookingType,
  VisaRequestType,
  PrivateJetRequest,
  HotelReservation,
  TourPackageRequest,
  ExecutiveShuttleRequest,
  TravelInsurance,
  SehembzPayRequest,
} from '../dtos/request.dto';
import { Prisma } from '@prisma/client';
import { addDays, addMonths, startOfDay, startOfMonth, startOfYear } from 'date-fns';
import { dateRangePresetToDates } from 'src/common/utils/dateRange';
import { buildPagination } from 'src/common/utils/pagination';

@Injectable()
export class RequestService {
  constructor(private readonly prisma: PrismaService) { }

  private mapToDto(request: any) {
    switch (request.requestType) {
      case 'FLIGHT_BOOKING':
        return request as FlightBookingType;
      case 'VISA_REQUEST':
        return request as VisaRequestType;
      case 'PRIVATE_JET':
        return request as PrivateJetRequest;
      case 'HOTEL_RESERVATION':
        return request as HotelReservation;
      case 'TOUR_PACKAGE':
        return request as TourPackageRequest;
      case 'EXECUTIVE_SHUTTLE':
        return request as ExecutiveShuttleRequest;
      case 'TRAVEL_INSURANCE':
        return request as TravelInsurance;
      case 'SEHEMBZ_PAY':
        return request as SehembzPayRequest;
      default:
        return request;
    }
  }

  async createFlightBooking(input: CreateFlightBookingInput): Promise<FlightBookingResponse> {
    const newRequest = await this.prisma.request.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        phoneNo: input.phoneNo,
        requestType: RequestType.FLIGHT_BOOKING,
        from: input.from,
        to: input.to,
        departureDate: input.departureDate,
        returnDate: input.returnDate,
        numberOfPersons: input.numberOfPersons,
        preferredAirline: input.preferredAirline,
        ticketClass: input.ticketClass,
        flightType: input.flightType,
        status: RequestStatus.OPEN,
      },
    });

    return {
      message: 'Flight booking request created successfully',
      flightRequest: this.mapToDto(newRequest),
    };
  }

  async createVisaRequest(input: VisaRequestInput): Promise<VisaRequestResponse> {
    const newRequest = await this.prisma.request.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        phoneNo: input.phoneNo,
        requestType: RequestType.VISA_ASSISTANCE,
        purposeOfTravel: input.purposeOfTravel,
        destinationCountry: input.destinationCountry,
        tavelTime: input.tavelTime,
        status: RequestStatus.OPEN,
      },
    });

    return {
      message: 'Visa assistance request created successfully',
      visaRequest: this.mapToDto(newRequest),
    };
  }

  async createPrivateJetRequest(input: RequestPrivateJetInput): Promise<RequestPrivatejetResponse> {
    const newRequest = await this.prisma.request.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        phoneNo: input.phoneNo,
        requestType: RequestType.PRIVATE_JET_CHARTER,
        from: input.from,
        to: input.to,
        departureDate: input.departureDate,
        returnDate: input.returnDate,
        numberOfPersons: input.numberOfPersons,
        flightType: input.flightType,
        typeOfJet: input.typeOfJet,
        status: RequestStatus.OPEN,
      },
    });

    return {
      message: 'Private jet charter request created successfully',
      requestData: this.mapToDto(newRequest),
    };
  }

  async createHotelReservation(input: RequestHotelreservtion): Promise<HotelReservationResponse> {
    const newRequest = await this.prisma.request.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        phoneNo: input.phoneNo,
        requestType: RequestType.HOTEL_RESERVATION,
        destinationCountry: input.destinationCountry,
        arrivalDate: input.arrivalDate,
        departureDate: input.departureDate,
        numberOfPersons: input.numberOfPersons,
        additionalRequest: input.additionalRequest ?? null,
        comment: input.comment ?? null,
        status: RequestStatus.OPEN,
      },
    });

    return {
      message: 'Hotel reservation request created successfully',
      requestData: this.mapToDto(newRequest),
    };
  }

  async createTourPackageRequest(input: RequestTourPackage): Promise<requestTourPackageResponse> {
    const newRequest = await this.prisma.request.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        phoneNo: input.phoneNo,
        requestType: RequestType.TOUR_PACKAGE,
        destinationCountry: input.destinationCountry,
        travelDate: input.travelDate,
        budget: input.budget,
        accomodationPreference: input.accomodationPreference,
        tourPackageType: input.tourPackageType,
        additionalRequest: input.additionalRequest ?? null,
        comment: input.comment ?? null,
        numberOfPersons: input.numberOfPersons,
        status: RequestStatus.OPEN,
      },
    });

    return {
      message: 'Tour package request created successfully',
      requestData: this.mapToDto(newRequest),
    };
  }

  async createExecutiveShuttleRequest(
    input: RequestExexutiveShuttleInput,
  ): Promise<RequestExexutiveShuttleResponse> {
    const newRequest = await this.prisma.request.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        phoneNo: input.phoneNo,
        requestType: RequestType.EXECUTIVE_SHUTTLE,
        arrivalAirport: input.arrivalAirport,
        arrivalDate: input.arrivalDate,
        arrivalTime: input.arrivalTime,
        numberOfPersons: input.numberOfPersons,
        rideType: input.rideType,
        status: RequestStatus.OPEN,
      },
    });

    return {
      message: 'Executive shuttle request created successfully',
      shuttleRequest: this.mapToDto(newRequest),
    };
  }

  async createTravelInsuranceRequest(
    input: RequestTravelInsurance,
  ): Promise<TravelInsuranceResponse> {
    const newRequest = await this.prisma.request.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        phoneNo: input.phoneNo,
        requestType: RequestType.TRAVEL_INSURANCE,
        durationOfInsurance: input.durationOfInsurance,
        numberOfPersons: input.numberOfPersons,
        destinationCountry: input.destinationCountry,
        insuranceType: input.insuranceType,
        status: RequestStatus.OPEN,
      },
    });

    return {
      message: 'Travel insurance request created successfully',
      requestData: this.mapToDto(newRequest),
    };
  }

  async createSehembzPayRequest(input: RequestSehembzPay): Promise<RequestSehembzPayResponse> {
    const newRequest = await this.prisma.request.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        phoneNo: input.phoneNo,
        requestType: RequestType.SEHEMBZ_PAY,
        reasonForContacting: input.reasonForContacting,
        amount: input.amount,
        status: RequestStatus.OPEN,
      },
    });

    return {
      message: 'Sehembz Pay request created successfully',
      requestData: this.mapToDto(newRequest),
    };
  }

  async updateRequestStatus(id: string, status: RequestStatus): Promise<BaseRequestType> {
    const existing = await this.prisma.request.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Request not found');

    const updated = await this.prisma.request.update({
      where: { id },
      data: { status },
    });

    return this.mapToDto(updated) as BaseRequestType

  }

  async getRequestById(id: string) {
    const request = await this.prisma.request.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Request not found');
    return this.mapToDto(request);
  }

async getAllRequests(filter: RequestFilterInput): Promise<PaginatedRequests> {
  const { 
    status, 
    requestType, 
    page = 1, 
    pageSize = 10,
    dateRangePreset, 
    startDate: filterStart, 
    endDate: filterEnd 
  } = filter || {};

  const { startDate, endDate } = dateRangePresetToDates(
    dateRangePreset,
    filterStart,
    filterEnd
  );

  const where: Prisma.RequestWhereInput = {};
  if (status) where.status = status;
  if (requestType) where.requestType = requestType;
  
  if (startDate && endDate) {
    where.createdAt = { gte: startDate, lte: endDate };
  }

  const total = await this.prisma.request.count({ where });
  
  const { skip, take } = buildPagination(page, pageSize);

  const data = await this.prisma.request.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });

  return { data: data.map(this.mapToDto), total, page, pageSize };
}
}
