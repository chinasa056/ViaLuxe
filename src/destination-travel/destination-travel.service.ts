
import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDestinationTravelInput,
  EditDestinationTravelInput,
  DestinationFilterInput,
  DestinationTravelResponse,
  PaginatedDestinations, 
  DestinationTravelType,
  DeleteDestinationResponse,
} from '../dtos/destination-travel.dto';
import { Status, Prisma } from '@prisma/client';
import { differenceInDays } from 'date-fns';
import { CompressionService } from '../common/utils/compression.service';
// Utilities for Abstraction
import { BaseContentService } from '../common/utils/base-content.service';
import { dateRangePresetToDates } from '../common/utils/dateRange';
import { buildDateWhere } from '../common/utils/dateWhereBuilder';
import { buildPagination } from '../common/utils/pagination';
import { deserializeJsonMedia, serializeJsonMedia } from '../common/utils/json-media-serializer';


@Injectable()
export class DestinationTravelService extends BaseContentService {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly compressionService: CompressionService,
  ) {
    super(prisma);
  }

  protected get model(): any {
    return this.prisma.destinationTravel;
  }

  protected get defaultInclude() {
    return {
      clientPriceOptions: true,
    };
  }

  protected async mapToDto(destination: any): Promise<DestinationTravelType> {
    const decompressedDescription = destination.description
      ? await this.compressionService.decompress(destination.description)
      : null;
    const decompressedActivities = destination.activities
      ? await this.compressionService.decompress(destination.activities)
      : null;

    return {
      ...destination,
      description: decompressedDescription || '',
      activities: decompressedActivities || '',
      coverMedia: deserializeJsonMedia(destination.coverMedia),
    } as DestinationTravelType;
  }

  private calculateDuration(departureDate: Date, returnDate: Date): number {
    const diff = differenceInDays(returnDate, departureDate);
    return diff >= 0 ? diff : 0;
  }

  async create(
    data: CreateDestinationTravelInput,
  ): Promise<DestinationTravelResponse> {

    const finalStatus = data.status || Status.DRAFT;

    if (finalStatus === Status.PUBLISHED) {
      if (!data.coverMedia || data.coverMedia.length === 0) {
        throw new HttpException('Cover media is required to publish a destination.', 400);
      }
      if (!data.priceOptions || data.priceOptions.length === 0) {
        throw new HttpException('At least one client category price option is required to publish.', 400);
      }
      if (!data.departureDate || !data.returnDate) {
        throw new HttpException('Departure and Return dates are required to publish the destination.', 400);
      }
    }

    const datePublished = finalStatus === Status.PUBLISHED ? new Date() : null;

    let duration = 0;
    if (data.departureDate && data.returnDate) {
      if (data.returnDate.getTime() < data.departureDate.getTime()) {
        throw new HttpException('Return date must be after departure date', 400);
      }
      duration = this.calculateDuration(
        data.departureDate,
        data.returnDate,
      );
    }

    const coverMediaJson = serializeJsonMedia(data.coverMedia);

    const compressedDescription = data.description
      ? await this.compressionService.compress(data.description)
      : null;

    const compressedActivities = data.activities
      ? await this.compressionService.compress(data.activities)
      : null;

    const destination = await this.prisma.destinationTravel.create({
      data: {
        tourTitle: data.tourTitle,
        location: data.location,
        minimumPrice: data.minimumPrice,
        description: compressedDescription,
        activities: compressedActivities,
        departureDate: data.departureDate,
        returnDate: data.returnDate,

        status: finalStatus,
        coverMedia: coverMediaJson,
        duration,
        datePublished,
        highlighted: data.highlighted ?? false,
        archived: data.archived ?? (finalStatus === Status.ARCHIVED),

        ...(data.priceOptions && data.priceOptions.length > 0 && {
          clientPriceOptions: {
            create: data.priceOptions.map(option => ({
              categoryName: option.categoryName?.trim(),
              price: option.price,
            })),
          },
        }),
      },
      include: this.defaultInclude,
    });

    return {
      message:
        finalStatus === Status.PUBLISHED
          ? 'Destination published successfully'
          : 'Destination saved as draft',
      destination: await this.mapToDto(destination),
    };
  }

  async edit(
    id: string,
    data: EditDestinationTravelInput,
  ): Promise<DestinationTravelResponse> {
    const existing = await this.prisma.destinationTravel.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
    if (!existing) throw new NotFoundException('Destination not found');
    
    // // Allow explicit unarchiving during edit
    // if (existing.archived && data.archived !== false) 
    //   throw new HttpException('Cannot edit an archived destination (must unarchive first)', 400);

    const finalStatus = data.status ?? existing.status;

    let currentDepartureDate = data.departureDate ?? existing.departureDate;
    let currentReturnDate = data.returnDate ?? existing.returnDate;

    if (finalStatus === Status.PUBLISHED) {

      const currentCoverMedia = data.coverMedia === undefined
        ? deserializeJsonMedia(existing.coverMedia)
        : (data.coverMedia ?? []);

      const hasPriceOptionsToUpsert = (data.priceOptionsToUpsert?.length ?? 0) > 0;

      // Filter existing price options based on pending deletions
      const existingPriceOptionsAfterDelete = existing.clientPriceOptions
        .filter(opt => !(data.priceOptionIdsToDelete || []).includes(opt.id));
      const existingPriceOptionCount = existingPriceOptionsAfterDelete.length;

      if (currentCoverMedia.length === 0) {
        throw new HttpException('Cover media (images) is required to publish the destination.', 400);
      }

      if (existingPriceOptionCount === 0 && !hasPriceOptionsToUpsert) {
        throw new HttpException('At least one client category price option must exist to publish the destination.', 400);
      }

      if (!currentDepartureDate || !currentReturnDate) {
        throw new HttpException('Departure and Return dates are required to publish the destination.', 400);
      }
    }

    let duration = existing.duration;
    let durationNeedsUpdate = false;

    if (currentDepartureDate && currentReturnDate) {
      if (currentReturnDate.getTime() < currentDepartureDate.getTime())
        throw new HttpException('Return date must be after departure date', 400);

      // Check if dates were changed or if we're publishing (forcing update)
      if (data.departureDate !== undefined || data.returnDate !== undefined || finalStatus === Status.PUBLISHED) {
        duration = this.calculateDuration(currentDepartureDate, currentReturnDate);
        durationNeedsUpdate = true;
      }
    }

    let datePublished = existing.datePublished;
    if (finalStatus === Status.PUBLISHED && !existing.datePublished) {
      datePublished = new Date();
    } else if (finalStatus !== Status.PUBLISHED) {
      datePublished = null;
    }

    const coverMediaJson = serializeJsonMedia(data.coverMedia);

    let compressedDescription: string | null | undefined = undefined;
    if (data.description !== undefined) {
      compressedDescription = data.description ? await this.compressionService.compress(data.description) : null;
    }
    let compressedActivities: string | null | undefined = undefined;
    if (data.activities !== undefined) {
      compressedActivities = data.activities ? await this.compressionService.compress(data.activities) : null;
    }

    const priceOptionsUpsertData = data.priceOptionsToUpsert?.map(option => ({
      where: { id: option.id || 'THIS_IS_A_NEW_RECORD_ID' },
      update: {
        categoryName: option.categoryName?.trim(),
        price: option.price,
      },
      create: {
        categoryName: option.categoryName!.trim(),
        price: option.price!,
      },
    }));

    const updateData: Prisma.DestinationTravelUpdateInput = {
      ...(data.tourTitle !== undefined && { tourTitle: data.tourTitle }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.minimumPrice !== undefined && { minimumPrice: data.minimumPrice }),
      ...(data.highlighted !== undefined && { highlighted: data.highlighted }),

      ...(compressedDescription !== undefined && { description: compressedDescription }),
      ...(compressedActivities !== undefined && { activities: compressedActivities }),

      status: finalStatus,
      datePublished,

      ...(data.coverMedia !== undefined && { coverMedia: coverMediaJson ?? Prisma.JsonNull }),

      ...(data.departureDate !== undefined && { departureDate: data.departureDate }),
      ...(data.returnDate !== undefined && { returnDate: data.returnDate }),

      ...(durationNeedsUpdate && { duration }),

      archived: data.archived ?? (finalStatus === Status.ARCHIVED ? true : existing.archived),
      ...((finalStatus !== Status.ARCHIVED && data.archived === undefined) && { archived: false }),
    };

    if (data.priceOptionsToUpsert || data.priceOptionIdsToDelete) {
      updateData.clientPriceOptions = {
        ...(priceOptionsUpsertData && { upsert: priceOptionsUpsertData }),
        ...(data.priceOptionIdsToDelete && {
          deleteMany: {
            id: { in: data.priceOptionIdsToDelete },
          },
        }),
      };
    }

    const updated = await this.prisma.destinationTravel.update({
      where: { id },
      data: updateData,
      include: this.defaultInclude,
    });

    return {
      message:
        finalStatus === Status.PUBLISHED
          ? 'Destination published successfully'
          : 'Destination updated successfully',
      destination: await this.mapToDto(updated),
    };
  }

  async updateDestinationTravelStatus(id: string, status: Status): Promise<DestinationTravelResponse> {
    const destination = await this.prisma.destinationTravel.findUnique({
      where: { id },
      include: this.defaultInclude,
    });

    if (!destination) {
      throw new NotFoundException('Destination travel not found');
    }
    
    // Check prerequisites for publishing/highlighting
    const isPublishingOrHighlighting = status === Status.PUBLISHED || status === Status.HIGHLIGHTED;
    if (isPublishingOrHighlighting) {
  
        if (deserializeJsonMedia(destination.coverMedia).length === 0) {
            throw new HttpException('Destination must have cover media before being published or highlighted.', 400);
        }
        if (!destination.departureDate || !destination.returnDate) {
            throw new HttpException('Destination must have departure and return dates before being published or highlighted.', 400);
        }
    }


    let message = '';
    let updateData: Prisma.DestinationTravelUpdateInput = {};

    switch (status) {
      case Status.ARCHIVED: {
        updateData = {
          archived: true,
          status: Status.ARCHIVED,
          highlighted: false,
        };
        message = 'Destination travel archived successfully';
        break;
      }
      
      case Status.HIGHLIGHTED: {
        if (destination.archived || destination.status === Status.DRAFT) {
          throw new HttpException('only published destination can be highlighted', 400);
        }
        
        // Use the BaseContentService method
        // await this.unhighlightAllForModel(); 
        const newHighlightStatus = !destination.highlighted;

        if (newHighlightStatus) {
          updateData = { 
            highlighted: true, 
            status: Status.HIGHLIGHTED, 
            archived: false,
            datePublished: destination.datePublished ?? new Date(),
          };
          message = 'Destination travel highlighted successfully';
        } else {
          message = 'Destination travel unhighlighted successfully';
          updateData = {
            highlighted: false,
            status: Status.PUBLISHED,
          };
        }
        break;
      }

      case Status.PUBLISHED: {
        updateData = {
          status: Status.PUBLISHED,
          archived: false,
          highlighted: false,
          datePublished: destination.datePublished ?? new Date(),
        };
        message = 'Destination travel published successfully';
        break;
      }

      case Status.DRAFT: {
        updateData = {
          status: Status.DRAFT,
          archived: false,
          highlighted: false,
          datePublished: null,
        };
        message = 'Destination travel moved to draft successfully';
        break;
      }

      default:
        throw new HttpException('Invalid status provided', 400);
    }

    const updated = await this.prisma.destinationTravel.update({
      where: { id },
      data: updateData,
      include: this.defaultInclude,
    });

    return {
      message,
      destination: await this.mapToDto(updated),
    };
  }

  async findOne(id: string): Promise<DestinationTravelType> {
    const item = await super.findOne(id);
    return item as DestinationTravelType;
  }

  async delete(id: string): Promise<DeleteDestinationResponse> {
    const existing = await this.prisma.destinationTravel.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Destination not found');

    await this.prisma.destinationTravel.delete({ where: { id } });

    return { message: 'Destination deleted successfully' };
  }

  // --- QUERIES ---

  async getHighlightedDestination(): Promise<DestinationTravelType[] | null> {
    const destinations = await this.prisma.destinationTravel.findMany({
      where: { highlighted: true, status: Status.HIGHLIGHTED },
      include: this.defaultInclude,
    });
      if(!destinations || destinations.length === 0) return null;
    else{
      const decompressedData = await Promise.all(destinations.map((tour) => this.mapToDto(tour)));
      return decompressedData;
    }
  }

  async getAllPublishedDestinations(): Promise<DestinationTravelType[]> {
    const destinations = await this.prisma.destinationTravel.findMany({
      where: { status: Status.PUBLISHED, archived: false },
      orderBy: { createdAt: 'desc' },
      include: this.defaultInclude,
    });

    return Promise.all(destinations.map(destination => this.mapToDto(destination)));
  };

  async findAll(
    filter: DestinationFilterInput,
  ): Promise<PaginatedDestinations> {
    const {
      status,
      location,
      dateRangePreset,
      page = 1,
      pageSize = 10,
    } = filter ?? {};

    const { startDate, endDate } = dateRangePresetToDates(
      dateRangePreset,
      filter?.startDate,
      filter?.endDate
    );

    const where: Prisma.DestinationTravelWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (location) {
      where.location = {
        contains: location
      };
    }

    Object.assign(where, buildDateWhere(status, startDate, endDate));

    const total = await this.prisma.destinationTravel.count({ where });

    const { skip, take } = buildPagination(page, pageSize);

    const data = await this.prisma.destinationTravel.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
      include: this.defaultInclude,
    });

    const mappedData = await Promise.all(data.map((d) => this.mapToDto(d)));

    return { data: mappedData, total, page, pageSize };
  }

  async searchDestinationTitle(title: string): Promise<DestinationTravelType[]> {
    if (!title || title.trim() === '') return [];
    const searchTrimmed = title.trim();

    const destinations = await this.prisma.destinationTravel.findMany({
      where: {
        tourTitle: {
          contains: searchTrimmed
        }
      },
      orderBy: { datePublished: 'desc' },
      take: 10,
      include: this.defaultInclude,
    });

    return Promise.all(destinations.map(d => this.mapToDto(d)));
  }
}