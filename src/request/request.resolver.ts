import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RequestService } from './request.service';
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
  BaseRequestType,
} from '../dtos/request.dto';
import { RequestUnion } from './request-union';
import { log } from 'console';
import { Public } from 'src/jwt/public.decorator';

@Resolver()
export class RequestResolver {
  constructor(private readonly requestService: RequestService) {}

  // CREATE MUTATIONS
  @Public()
  @Mutation(() => FlightBookingResponse)
  requestFlightBooking(@Args('input') input: CreateFlightBookingInput) {
    return this.requestService.createFlightBooking(input);
  }

  @Public()
  @Mutation(() => VisaRequestResponse)
  createVisaRequest(@Args('input') input: VisaRequestInput) {
    return this.requestService.createVisaRequest(input);
  }

  @Public()
  @Mutation(() => RequestPrivatejetResponse)
  requestPrivateJet(@Args('input') input: RequestPrivateJetInput) {
    return this.requestService.createPrivateJetRequest(input);
  }

  @Public()
  @Mutation(() => HotelReservationResponse)
  requestHotelReservation(@Args('input') input: RequestHotelreservtion) {
    return this.requestService.createHotelReservation(input);
  }

  @Public()
  @Mutation(() => requestTourPackageResponse)
  requestTourPackage(@Args('input') input: RequestTourPackage) {
    return this.requestService.createTourPackageRequest(input);
  }

  @Public()
  @Mutation(() => RequestExexutiveShuttleResponse)
  requestExecutiveShuttle(@Args('input') input: RequestExexutiveShuttleInput) {
    return this.requestService.createExecutiveShuttleRequest(input);
  }

  @Public()
  @Mutation(() => TravelInsuranceResponse)
  requestTravelInsurance(@Args('input') input: RequestTravelInsurance) {
    return this.requestService.createTravelInsuranceRequest(input);
  }

  @Public()
  @Mutation(() => RequestSehembzPayResponse)
  requestSehembzPay(@Args('input') input: RequestSehembzPay) {
    return this.requestService.createSehembzPayRequest(input);
  }

// STATUS UPDATE
@Mutation(() => BaseRequestType, { name: 'updateRequestStatus' })
updateRequestStatus(
    @Args('id', { type: () => String }) id: string, 
    @Args('status', { type: () => RequestStatus }) status: RequestStatus 
) {
    return this.requestService.updateRequestStatus(id, status);
}

  // QUERIES
@Query(() => RequestUnion, { nullable: true })
async getRequestById(@Args('id') id: string) {
  return this.requestService.getRequestById(id);
}


  @Query(() => PaginatedRequests)
  getAllRequests(@Args('filter', { nullable: true }) filter: RequestFilterInput) {
    return this.requestService.getAllRequests(filter);
  }
}
