import {
  Field,
  GraphQLISODateTime,
  ID,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";
import { RequestUnion } from "src/request/request-union";


export enum RequestStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum FlightType {
  ONE_WAY = "ONE_WAY",
  ROUND_TRIP = "ROUND_TRIP",
  MULTI_CITY = "MULTI_CITY",
}

export enum RideType {
  AIRPORT_PICKUP = "AIRPORT_PICKUP",
  CAR_HIRE = "CAR_HIRE",
}

export enum RequestType {
  FLIGHT_BOOKING = "FLIGHT_BOOKING",
  HOTEL_RESERVATION = "HOTEL_RESERVATION",
  VISA_ASSISTANCE = "VISA_ASSISTANCE",
  PRIVATE_JET_CHARTER = "PRIVATE_JET_CHARTER",
  EXECUTIVE_SHUTTLE = "EXECUTIVE_SHUTTLE",
  TRAVEL_INSURANCE = "TRAVEL_INSURANCE",
  SEHEMBZ_PAY = "SEHEMBZ_PAY",
  TOUR_PACKAGE = "TOUR_PACKAGE",
}

registerEnumType(RequestStatus, { name: "RequestStatus" });
registerEnumType(FlightType, { name: "FlightType" });
registerEnumType(RideType, { name: "RideType" });
registerEnumType(RequestType, { name: "RequestType" });

@ObjectType()
export class BaseRequestType {
  @Field(() => ID) id: string;

  @Field(() => String) fullName: string;

  @Field(() => String) email: string;

  @Field(() => String) phoneNo: string;

  @Field(() => GraphQLISODateTime) requestDate: Date;

  @Field(() => RequestStatus) status: RequestStatus;

  @Field(() => RequestType) requestType: RequestType;
}

@ObjectType()
export class FlightBookingType extends BaseRequestType {
  @Field(() => String) from: string;

  @Field(() => String) to: string;

  @Field(() => GraphQLISODateTime) departureDate: Date;

  @Field(() => GraphQLISODateTime, { nullable: true }) returnDate?: Date;

  @Field(() => Int) numberOfPersons: number;

  @Field(() => String) preferredAirline: string;

  @Field(() => String) ticketClass: string;

  @Field(() => FlightType) flightType: FlightType;

  @Field(() => GraphQLISODateTime) createdAt: Date;

  @Field(() => GraphQLISODateTime) updatedAt: Date;
}

@InputType()
export class CreateFlightBookingInput {
  @Field(() => String) @IsString() @IsNotEmpty()
  fullName: string;

  @Field(() => String) @IsEmail() @IsNotEmpty()
  email: string;

  @Field(() => String) @IsString() @IsNotEmpty()
  phoneNo: string;

  @Field(() => RequestType) @IsEnum(RequestType) @IsNotEmpty()
  requestType: RequestType;

  @Field(() => String) @IsString() @IsNotEmpty()
  from: string;

  @Field(() => String) @IsString() @IsNotEmpty()
  to: string;

  @Field(() => GraphQLISODateTime) @IsDate() @IsNotEmpty()
  departureDate: Date;

  @Field(() => GraphQLISODateTime, { nullable: true }) @IsDate() @IsOptional()
  returnDate?: Date;

  @Field(() => Int) @IsNumber() @IsNotEmpty()
  numberOfPersons: number;

  @Field(() => String) @IsString() @IsNotEmpty()
  preferredAirline: string;

  @Field(() => String) @IsString() @IsNotEmpty()
  ticketClass: string;

  @Field(() => FlightType) @IsEnum(FlightType)
  flightType: FlightType;
}

@ObjectType()
export class FlightBookingResponse {
  @Field(() => String)
  message: string;

  @Field(() => FlightBookingType)
  flightRequest: FlightBookingType;
}

@ObjectType()
export class VisaRequestType extends BaseRequestType {
  @Field(() => String)
  purposeOfTravel?: string;

  @Field(() => String)
  destinationCountry: string;

  @Field(() => GraphQLISODateTime)
  tavelTime: Date;

  @Field(() => RequestType)
  requestType: RequestType;
}

@InputType()
export class VisaRequestInput {
  @Field(() => String) @IsString() @IsNotEmpty() fullName: string;

  @Field(() => String) @IsEmail() @IsNotEmpty() email: string;

  @Field(() => String) @IsString() @IsNotEmpty() phoneNo: string;

  @Field(() => RequestType) @IsEnum(RequestType) @IsNotEmpty() requestType: RequestType;

  @Field(() => String) @IsString() @IsNotEmpty() purposeOfTravel: string;

  @Field(() => String) @IsString() @IsNotEmpty() destinationCountry: string;

  @Field(() => GraphQLISODateTime) @IsDate() @IsNotEmpty() tavelTime: Date;
}

@ObjectType()
export class VisaRequestResponse {
  @Field(() => String)
  message: string;

  @Field(() => VisaRequestType)
  visaRequest: VisaRequestType;
}

@ObjectType()
export class ExecutiveShuttleRequest extends BaseRequestType {
  @Field(() => String) arrivalAirport: string;

  @Field(() => GraphQLISODateTime) arrivalDate: Date;

  @Field(() => String) arrivalTime: String;

  @Field(() => RideType) rideType: RideType;
}

@InputType()
export class RequestExexutiveShuttleInput {
  @Field(() => String) @IsString() @IsNotEmpty() fullName: string;

  @Field(() => String) @IsEmail() @IsNotEmpty() email: string;

  @Field(() => String) @IsString() @IsNotEmpty() phoneNo: string;

  @Field(() => RequestType) @IsEnum(RequestType) @IsNotEmpty()

  requestType: RequestType;
  @Field(() => String) @IsString() @IsNotEmpty() arrivalAirport: string;

  @Field(() => GraphQLISODateTime) @IsDate() @IsNotEmpty() arrivalDate: Date;

@Field(() => String) @IsString() @IsNotEmpty()
@Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "arrivalTime must be in HH:mm format" })
arrivalTime: string;


@Field(() => Int) @IsNumber() @IsNotEmpty() numberOfPersons: number;

@Field(() => RideType) @IsEnum(RideType)
rideType: RideType;
}

@ObjectType()
export class RequestExexutiveShuttleResponse {
  @Field(() => String)
  message: string;

  @Field(() => ExecutiveShuttleRequest)
  shuttleRequest: ExecutiveShuttleRequest;
}

@ObjectType()
export class PrivateJetRequest extends BaseRequestType {
  @Field(() => String) from: string;
  @Field(() => String) to: string;
  @Field(() => GraphQLISODateTime) departureDate: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) returnDate?: Date;
  @Field(() => FlightType) flightType: FlightType;
  @Field(() => Int) numberOfPersons: number;
  @Field(() => String) typeOfJet: string;
}

@InputType()
export class RequestPrivateJetInput {
  @Field(() => String) @IsString() @IsNotEmpty() fullName: string;
  @Field(() => String) @IsEmail() @IsNotEmpty() email: string;
  @Field(() => String) @IsString() @IsNotEmpty() phoneNo: string;
  @Field(() => RequestType) @IsEnum(RequestType) @IsNotEmpty() requestType: RequestType;
  @Field(() => String) @IsString() @IsNotEmpty() from: string;
  @Field(() => String) @IsString() @IsNotEmpty() to: string;
  @Field(() => GraphQLISODateTime) @IsDate() @IsNotEmpty() departureDate: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) @IsDate() @IsOptional() returnDate?: Date;
  @Field(() => Int) @IsNumber() @IsNotEmpty() numberOfPersons: number;
  @Field(() => FlightType) @IsEnum(FlightType)
  flightType: FlightType;
  @Field(() => String) @IsString() @IsNotEmpty() typeOfJet: string;
}

@ObjectType()
export class RequestPrivatejetResponse {
  @Field(() => String)
  message: string;

  @Field(() => PrivateJetRequest)
  requestData: PrivateJetRequest;
}

@ObjectType()
export class SehembzPayRequest extends BaseRequestType {
  @Field(() => String)
  reasonForContacting?: string;

  @Field(() => String)
  amount: string;
}

@InputType()
export class RequestSehembzPay {
  @Field(() => String) @IsString() @IsNotEmpty() fullName: string;
  @Field(() => String) @IsEmail() @IsNotEmpty() email: string;
  @Field(() => String) @IsString() @IsNotEmpty() phoneNo: string;
  @Field(() => RequestType) @IsEnum(RequestType) @IsNotEmpty() requestType: RequestType;
  @Field(() => String) @IsString() @IsNotEmpty() reasonForContacting: string;
  @Field(() => String) @IsString() @IsNotEmpty() amount: string;
}

@ObjectType()
export class RequestSehembzPayResponse {
  @Field(() => String)
  message: string;

  @Field(() => SehembzPayRequest)
  requestData: SehembzPayRequest;
}

@ObjectType()
export class TourPackageRequest extends BaseRequestType {
  @Field(() => String)
  destinationCountry: string;

  @Field(() => String)
  budget: string;

  @Field(() => GraphQLISODateTime)
  travelDate: Date;

  @Field(() => Int)
  numberOfPersons: number;

  @Field(() => RequestType)
  requestType: RequestType;

  @Field(() => String)
  accomodationPreference: string;

  @Field(() => String)
  tourPackageType: string;

  @Field(() => String, { nullable: true })
  additionalRequest?: string | null;

  @Field(() => String)
  comment: string;
}

@InputType()
export class RequestTourPackage {
  @Field(() => String) @IsString() @IsNotEmpty() fullName: string;
  @Field(() => String) @IsEmail() @IsNotEmpty() email: string;
  @Field(() => String) @IsString() @IsNotEmpty() phoneNo: string;
  @Field(() => RequestType) @IsEnum(RequestType) @IsNotEmpty() requestType: RequestType;
  @Field(() => String) @IsString() @IsNotEmpty() destinationCountry: string;
  @Field(() => String) @IsString() @IsNotEmpty() budget: string;
  @Field(() => GraphQLISODateTime) @IsDate() @IsNotEmpty() travelDate: Date;
  @Field(() => Int) @IsNumber() @IsNotEmpty() numberOfPersons: number;
  @Field(() => String) @IsString() @IsNotEmpty() accomodationPreference: string;
  @Field(() => String) @IsString() @IsNotEmpty() tourPackageType: string;
  @Field(() => String, {nullable: true}) @IsString() @IsOptional() additionalRequest?: string | null;
  @Field(() => String, {nullable: true}) @IsString() @IsNotEmpty() comment?: string | null;
}

@ObjectType()
export class requestTourPackageResponse {
  @Field(() => String)
  message: string;

  @Field(() => TourPackageRequest)
  requestData: TourPackageRequest;
}

@ObjectType()
export class HotelReservation extends BaseRequestType {
  @Field(() => GraphQLISODateTime) arrivalDate: Date;
  @Field(() => GraphQLISODateTime) departureDate: Date;
  @Field(() => Int) numberOfPersons: number;
  @Field(() => String) destinationCountry: string;
  @Field(() => String) comment: string;
  @Field(() => String, { nullable: true })
  additionalRequest?: string | null;
  @Field(() => GraphQLISODateTime) createdAt: Date;
  @Field(() => GraphQLISODateTime) updatedAt: Date;
}

@InputType()
export class RequestHotelreservtion {
  @Field(() => String) @IsString() @IsNotEmpty() fullName: string;
  @Field(() => String) @IsEmail() @IsNotEmpty() email: string;
  @Field(() => String) @IsString() @IsNotEmpty() phoneNo: string;
  @Field(() => RequestType) @IsEnum(RequestType) @IsNotEmpty() requestType: RequestType;
  @Field(() => GraphQLISODateTime) @IsDate() @IsNotEmpty() arrivalDate: Date;
  @Field(() => GraphQLISODateTime) @IsDate() @IsNotEmpty() departureDate: Date;
  @Field(() => Int) @IsNumber() @IsNotEmpty() numberOfPersons: number;
  @Field(() => String) @IsString() @IsNotEmpty() destinationCountry: string;
  @Field(() => String, {nullable: true}) @IsString() @IsNotEmpty() comment?: string | null;
  @Field(() => String, {nullable: true}) @IsString() @IsNotEmpty() additionalRequest?: string | null;
}

@ObjectType()
export class HotelReservationResponse {
  @Field(() => String)
  message: string;

  @Field(() => HotelReservation)
  requestData: HotelReservation;
}

@ObjectType()
export class TravelInsurance extends BaseRequestType {
  @Field(() => Int) durationOfInsurance: number;
  @Field(() => Int) numberOfPersons: number;
  @Field(() => String) destinationCountry: string;
  @Field(() => String) insuranceType: string;
  @Field(() => GraphQLISODateTime) createdAt: Date;
  @Field(() => GraphQLISODateTime) updatedAt: Date;
}

@InputType()
export class RequestTravelInsurance {
  @Field(() => String) @IsString() @IsNotEmpty() fullName: string;
  @Field(() => String) @IsEmail() @IsNotEmpty() email: string;
  @Field(() => String) @IsString() @IsNotEmpty() phoneNo: string;
  @Field(() => RequestType) @IsEnum(RequestType) @IsNotEmpty() requestType: RequestType;
  @Field(() => Int) @IsNumber() @IsNotEmpty() durationOfInsurance: number;
  @Field(() => Int) @IsNumber() @IsNotEmpty() numberOfPersons: number;
  @Field(() => String) @IsString() @IsNotEmpty() destinationCountry: string;
  @Field(() => String) @IsString() @IsNotEmpty() insuranceType: string;
}

@ObjectType()
export class TravelInsuranceResponse {
  @Field(() => String)
  message: string;

  @Field(() => TravelInsurance)
  requestData: TravelInsurance;
}

@InputType()
export class RequestFilterInput {
  @Field(() => RequestType, { nullable: true })
  @IsOptional()
  @IsEnum(RequestType)
  requestType?: RequestType;

  @Field(() => RequestStatus, { nullable: true })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  dateRangePreset?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @IsNumber()
  pageSize?: number = 10;
}


@ObjectType()
export class PaginatedRequests {
  @Field(() => [RequestUnion])
  data: Array<typeof RequestUnion>;

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;
}

