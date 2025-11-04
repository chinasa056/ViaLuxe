import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateTourPackageInput,
  EditTourPackageInput,
  PaginatedTours,
  TourFilterInput,
  CreateTourResponse,
  TourPackageType,
} from 'src/dtos/tour-package.dto';
import { Prisma, Status } from '@prisma/client';
import { differenceInDays } from 'date-fns';
import { CompressionService } from '../common/utils/compression.service';
import { BaseContentService } from '../common/utils/base-content.service';
import { buildDateWhere } from '../common/utils/dateWhereBuilder';
import { buildPagination } from '../common/utils/pagination';
import {
  deserializeJsonMedia,
  serializeJsonMedia,
} from '../common/utils/json-media-serializer';

@Injectable()
export class TourPackageService extends BaseContentService {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly compressionService: CompressionService,
  ) {
    super(prisma);
  }

  protected get model(): any {
    return this.prisma.tourPackage;
  }

  protected get defaultInclude() {
    return {
      tourType: true,
      clientPriceOptions: true,
    };
  }

  protected async mapToDto(tour: any): Promise<TourPackageType> {
    const decompressedDescription = tour.description
      ? await this.compressionService.decompress(tour.description)
      : '';
    const decompressedActivities = tour.activities
      ? await this.compressionService.decompress(tour.activities)
      : '';

    return {
      ...tour,
      description: decompressedDescription || '',
      activities: decompressedActivities || '',
      // Use the imported utility
      coverMedia: deserializeJsonMedia(tour.coverMedia),
    } as TourPackageType;
  }

  private calculateDuration(departure: Date, ret: Date): number {
    const diff = differenceInDays(ret, departure);
    return diff >= 0 ? diff : 0;
  }

  async createTourPackage(
    data: CreateTourPackageInput,
  ): Promise<CreateTourResponse> {
    const finalStatus = data.status || Status.DRAFT;

    if (finalStatus === Status.PUBLISHED) {
      if (!data.tourTypeId) {
        throw new HttpException(
          'Tour Type ID is required to publish a Tour Package.',
          400,
        );
      }

      if (!data.coverMedia || data.coverMedia.length === 0) {
        throw new HttpException(
          'Cover media (images) is required for the tour package when publishing.',
          400,
        );
      }

      if (!data.priceOptions || data.priceOptions.length === 0) {
        throw new HttpException(
          'At least one client category price option is required when publishing.',
          400,
        );
      }

      if (!data.departureDate || !data.returnDate) {
        throw new HttpException(
          'Departure and Return dates are required for tour creation when publishing.',
          400,
        );
      }
    }

    if (data.tourTypeId) {
      const tourType = await this.prisma.tourType.findUnique({
        where: { id: data.tourTypeId },
      });
      if (!tourType) throw new HttpException('Tour Type not found', 404);
    }

    const datePublished = finalStatus === Status.PUBLISHED ? new Date() : null;

    let duration = 0;
    if (data.departureDate && data.returnDate) {
      if (data.returnDate.getTime() < data.departureDate.getTime()) {
        throw new HttpException(
          'Return date must be after departure date',
          400,
        );
      }

      duration = this.calculateDuration(data.departureDate, data.returnDate);
    }

    // Use the imported utility
    const coverMediaJson = serializeJsonMedia(data.coverMedia);

    const compressedDescription = data.description
      ? await this.compressionService.compress(data.description)
      : '';
    const compressedActivities = data.activities
      ? await this.compressionService.compress(data.activities)
      : '';

    const createData: Prisma.TourPackageCreateInput = {
      tourTitle: data.tourTitle ?? undefined,
      location: data.location ?? undefined,
      minimumPrice: data.minimumPrice ?? undefined,
      ...(data.tourTypeId && {
        tourType: {
          connect: { id: data.tourTypeId },
        },
      }),

      description: compressedDescription ?? '',
      activities: compressedActivities ?? '',
      duration,
      status: finalStatus,
      datePublished,
      coverMedia: coverMediaJson ?? Prisma.JsonNull,
      highlighted: data.highlighted ?? false,
      archived: data.archived ?? false,

      ...(data.priceOptions &&
        data.priceOptions.length > 0 && {
          clientPriceOptions: {
            create: data.priceOptions.map((option) => ({
              categoryName: option.categoryName.trim(),
              price: option.price,
            })),
          },
        }),
      ...(data.departureDate !== undefined && {
        departureDate: data.departureDate,
      }),
      ...(data.returnDate !== undefined && { returnDate: data.returnDate }),
    };

    const newTour = await this.prisma.tourPackage.create({
      data: createData,
      include: this.defaultInclude,
    });

    const message =
      finalStatus === Status.PUBLISHED
        ? 'Tour published successfully'
        : 'Tour saved as draft successfully';

    return { message, tour: await this.mapToDto(newTour) };
  }

  async editTourPackage(
    id: string,
    data: EditTourPackageInput,
  ): Promise<CreateTourResponse> {
    const existing = await this.prisma.tourPackage.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
    if (!existing) throw new NotFoundException('Tour Package not found');

    if (existing.archived)
      throw new HttpException('Cannot edit an archived Tour Package', 400);

    const finalStatus = data.status ?? existing.status;

    if (finalStatus === Status.PUBLISHED) {
      const currentTourTypeId = data.tourTypeId ?? existing.tourTypeId;

      // Use the imported utility
      const currentCoverMedia =
        data.coverMedia === undefined
          ? deserializeJsonMedia(existing.coverMedia)
          : (data.coverMedia ?? []);

      const hasPriceOptionsToUpsert =
        (data.priceOptionsToUpsert?.length ?? 0) > 0;

      // Filter existing price options based on pending deletions
      const existingPriceOptionsAfterDelete =
        existing.clientPriceOptions.filter(
          (opt) => !(data.priceOptionIdsToDelete || []).includes(opt.id),
        );
      const existingPriceOptionCount = existingPriceOptionsAfterDelete.length;

      const currentDepartureDate = data.departureDate ?? existing.departureDate;
      const currentReturnDate = data.returnDate ?? existing.returnDate;

      if (!currentTourTypeId) {
        throw new HttpException(
          'Tour Type ID is required to publish a Tour Package.',
          400,
        );
      }

      if (currentCoverMedia.length === 0) {
        throw new HttpException(
          'Cover media (images) is required to publish the tour package.',
          400,
        );
      }

      if (existingPriceOptionCount === 0 && !hasPriceOptionsToUpsert) {
        throw new HttpException(
          'At least one client category price option must exist to publish the tour package.',
          400,
        );
      }

      if (!currentDepartureDate || !currentReturnDate) {
        throw new HttpException(
          'Departure and Return dates are required to publish the tour package.',
          400,
        );
      }

      if (data.tourTypeId) {
        const tourType = await this.prisma.tourType.findUnique({
          where: { id: data.tourTypeId },
        });
        if (!tourType) throw new HttpException('Tour Type not found', 404);
      }
    }

    let duration = existing.duration;
    const departure = data.departureDate ?? existing.departureDate;
    const ret = data.returnDate ?? existing.returnDate;

    if (
      departure &&
      ret &&
      (data.departureDate ||
        data.returnDate ||
        finalStatus === Status.PUBLISHED)
    ) {
      if (ret.getTime() < departure.getTime())
        throw new HttpException(
          'Return date must be after departure date',
          400,
        );
      duration = this.calculateDuration(departure, ret);
    }

    let datePublished = existing.datePublished;
    if (finalStatus === Status.PUBLISHED && !existing.datePublished) {
      datePublished = new Date();
    } else if (finalStatus !== Status.PUBLISHED) {
      datePublished = null;
    }

    // Use the imported utility
    const coverMediaJson = serializeJsonMedia(data.coverMedia);

    let compressedDescription: string | undefined = undefined;
    if (data.description !== undefined) {
      // Logic for empty string vs null
      compressedDescription = data.description
        ? ((await this.compressionService.compress(data.description)) ?? '')
        : '';
    }
    let compressedActivities: string | undefined = undefined;
    if (data.activities !== undefined) {
      // Logic for empty string vs null
      compressedActivities = data.activities
        ? ((await this.compressionService.compress(data.activities)) ?? '')
        : '';
    }

    const priceOptionsUpsertData = data.priceOptionsToUpsert?.map((option) => ({
      where: { id: option.id || '' },
      update: {
        categoryName: option.categoryName?.trim(),
        price: option.price,
      },
      create: {
        categoryName: option.categoryName!.trim(),
        price: option.price!,
      },
    }));

    const updateData: Prisma.TourPackageUpdateInput = {
      ...(data.tourTitle !== undefined && { tourTitle: data.tourTitle }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.minimumPrice !== undefined && {
        minimumPrice: data.minimumPrice,
      }),
      // departure/return only if provided
      ...(data.departureDate !== undefined && {
        departureDate: data.departureDate,
      }),
      ...(data.returnDate !== undefined && { returnDate: data.returnDate }),
      ...(data.departureDate || data.returnDate ? { duration } : {}),

      ...(data.highlighted !== undefined && { highlighted: data.highlighted }),
      ...(data.archived !== undefined && { archived: data.archived }),
      status: finalStatus,
      datePublished,
      // Use the result of the imported utility
      coverMedia: coverMediaJson ?? Prisma.JsonNull,
      ...(data.tourTypeId && {
        tourType: {
          connect: { id: data.tourTypeId },
        },
      }),
    };

    if (compressedDescription !== undefined) {
      updateData.description = compressedDescription;
    }
    if (compressedActivities !== undefined) {
      updateData.activities = compressedActivities;
    }

    if (data.priceOptionsToUpsert || data.priceOptionIdsToDelete) {
      updateData.clientPriceOptions = {
        ...(priceOptionsUpsertData && { upsert: priceOptionsUpsertData }),
        ...(data.priceOptionIdsToDelete && {
          deleteMany: {
            id: {
              in: data.priceOptionIdsToDelete,
            },
          },
        }),
      };
    }

    // Run update
    const updated = await this.prisma.tourPackage.update({
      where: { id },
      data: updateData,
      include: this.defaultInclude,
    });

    return {
      message:
        finalStatus === Status.PUBLISHED
          ? 'Tour Package published successfully'
          : 'Tour Package updated successfully',
      tour: await this.mapToDto(updated),
    };
  }

  async updateTourPackageStatus(
    id: string,
    status: Status,
  ): Promise<CreateTourResponse> {
    const tour = await this.prisma.tourPackage.findUnique({
      where: { id },
      // Include all necessary relations for validation/mapping
      include: this.defaultInclude,
    });

    if (!tour) throw new NotFoundException('Tour not found');

    let message = '';
    let updateData: Prisma.TourPackageUpdateInput = {};

    switch (status) {
      case Status.ARCHIVED: {
        if (tour.status !== Status.PUBLISHED && !tour.archived) {
          throw new HttpException('Cannot archive a draft tour package', 400);
        }

        if (!tour.archived) {
          message = 'Tour package archived successfully';
          updateData = {
            archived: true,
            status: Status.ARCHIVED,
            highlighted: false,
          };
        } else {
          message = 'Tour package unarchived successfully';
          updateData = {
            archived: false,
            status: Status.PUBLISHED,
            highlighted: false,
          };
        }
        break;
      }

      case Status.HIGHLIGHTED: {
        if (tour.status === Status.DRAFT || tour.archived) {
          throw new HttpException(
            'Only published tours can be highlighted',
            400,
          );
        }

        const newHighlightStatus = !tour.highlighted;

        if (newHighlightStatus) {
          // Use the BaseContentService method
          // await this.unhighlightAllForModel();

          message = 'Tour package highlighted successfully';
          updateData = {
            highlighted: true,
            status: Status.HIGHLIGHTED,
            archived: false,
            datePublished: tour.datePublished || new Date(),
          };
        } else {
          message = 'Tour package unhighlighted successfully';
          updateData = {
            highlighted: false,
            status: Status.PUBLISHED,
          };
        }
        break;
      }

      case Status.PUBLISHED: {
        if (tour.status === Status.PUBLISHED) {
          throw new HttpException('Tour package is already published', 400);
        }

        message = 'Tour package published successfully';
        updateData = {
          status: Status.PUBLISHED,
          archived: false,
          highlighted: false,
          datePublished: new Date(),
        };
        break;
      }

      case Status.DRAFT: {
        message = 'Tour package moved to draft successfully';
        updateData = {
          status: Status.DRAFT,
          archived: false,
          highlighted: false,
          datePublished: null,
        };
        break;
      }

      default:
        throw new HttpException('Invalid status provided', 400);
    }

    const updated = await this.prisma.tourPackage.update({
      where: { id },
      data: updateData,
      include: this.defaultInclude,
    });

    return {
      message,
      tour: await this.mapToDto(updated),
    };
  }

  async getOneTourPackage(id: string): Promise<TourPackageType | null> {
    const item = await super.findOne(id);
    return item as TourPackageType;
  }

  async deleteTourPackage(id: string): Promise<string> {
    const tour = await this.prisma.tourPackage.findUnique({ where: { id } });
    if (!tour) throw new HttpException('Tour not found', 404);
    await this.prisma.tourPackage.delete({ where: { id } });
    return 'Tour package deleted successfully';
  }

  // --- QUERIES ---

  async getHighlightedTourPackage(): Promise<TourPackageType[] | null> {
    const tours = await this.prisma.tourPackage.findMany({
      where: { status: Status.HIGHLIGHTED },
      include: this.defaultInclude,
    });
    if(!tours || tours.length === 0) return null;
    else{
      const decompressedData = await Promise.all(tours.map((tour) => this.mapToDto(tour)));
      return decompressedData;
    }

  }

  async getAllPublishedTours(): Promise<TourPackageType[]> {
    const tours = await this.prisma.tourPackage.findMany({
      where: { status: Status.PUBLISHED, archived: false },
      orderBy: { createdAt: 'desc' },
      include: this.defaultInclude,
    });

    return Promise.all(tours.map((tour) => this.mapToDto(tour)));
  }

  async getAllTours(filter: TourFilterInput): Promise<PaginatedTours> {
    const {
      status,
      tourTypeId,
      location,
      startDate,
      endDate,
      page = 1,
      pageSize = 10,
    } = filter ?? {};

    const where: Prisma.TourPackageWhereInput = {};

    if (status) where.status = status;
    if (tourTypeId) where.tourTypeId = tourTypeId;
    if (location) where.location = { contains: location };

    // Use Utility to build date condition
    if (startDate && endDate) {
      Object.assign(where, buildDateWhere(status, startDate, endDate));
    }

    const total = await this.prisma.tourPackage.count({ where });

    const { skip, take } = buildPagination(page, pageSize);

    const data = await this.prisma.tourPackage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: this.defaultInclude,
    });

    const decompressedData = await Promise.all(
      data.map((tour) => this.mapToDto(tour)),
    );

    return { data: decompressedData, total, page, pageSize };
  }

  async searchTourTitle(title: string): Promise<TourPackageType[]> {
    if (!title || title.trim() === '') return [];
    const searchTrimmed = title.trim();

    const tours = await this.prisma.tourPackage.findMany({
      where: {
        tourTitle: {
          contains: searchTrimmed,
        },
      },
      orderBy: { datePublished: 'desc' },
      take: 10,
      include: this.defaultInclude,
    });

    return Promise.all(tours.map((tour) => this.mapToDto(tour)));
  }
}
