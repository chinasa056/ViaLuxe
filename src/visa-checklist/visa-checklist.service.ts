import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateVisaChecklistInput,
  EditVisaChecklistInput,
  VisaChecklistFilterInput,
  VisaChecklistResponse,
  PaginatedVisaChecklists,
  VisaChecklistType,
  DeleteVisaChecklistResponse,
} from '../dtos/visa-checklist.dto';
import { Status, Prisma } from '@prisma/client';
import { CompressionService } from '../common/utils/compression.service';
import { BaseContentService } from '../common/utils/base-content.service';
import { dateRangePresetToDates } from '../common/utils/dateRange';
import { buildDateWhere } from '../common/utils/dateWhereBuilder';
import { buildPagination } from '../common/utils/pagination';
import { deserializeJsonMedia, serializeJsonMedia } from '../common/utils/json-media-serializer';


@Injectable()
export class VisaChecklistService extends BaseContentService {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly compressionService: CompressionService,
  ) {
    super(prisma);
  }

  protected get model(): any {
    return this.prisma.visaChecklist;
  }

  protected get defaultInclude() {
    return {
      visaPriceOptions: true,
    };
  }

  protected async mapToDto(checklist: any): Promise<VisaChecklistType> {
    const decompressedDescription = checklist.description
      ? await this.compressionService.decompress(checklist.description)
      : '';

    return {
      ...checklist,
      description: decompressedDescription || '',
      images: deserializeJsonMedia(checklist.images),
    } as VisaChecklistType;
  }

  async create(data: CreateVisaChecklistInput): Promise<VisaChecklistResponse> {
    const finalStatus = data.status || Status.DRAFT;

    if (finalStatus === Status.PUBLISHED) {
      if (!data.images || data.images.length === 0) {
        throw new HttpException('Images are required to publish a visa checklist', 400);
      }
      if (!data.visaPriceOptions || data.visaPriceOptions.length === 0) {
        throw new HttpException('At least one visa duration price option is required to publish.', 400);
      }
    }

    const datePublished = finalStatus === Status.PUBLISHED ? new Date() : null;
    
    const imagesJson = serializeJsonMedia(data.images);

    const compressedDescription = data.description
      ? await this.compressionService.compress(data.description)
      : null;

    const createData: Prisma.VisaChecklistCreateInput = {
      country: data.country ?? undefined,
      location: data.location ?? undefined,
      description: compressedDescription ?? '',
      status: finalStatus,
      images: imagesJson ?? Prisma.JsonNull,
      datePublished,
      highlighted: data.highlighted ?? false,
      archived: data.archived ?? (finalStatus === Status.ARCHIVED),
      ...(data.visaPriceOptions && data.visaPriceOptions.length > 0 && {
        visaPriceOptions: {
          create: data.visaPriceOptions.map(option => ({
            durationInDays: option.durationInDays,
            price: option.price,
          })),
        },
      }),
    };

    const checklist = await this.prisma.visaChecklist.create({
      data: createData,
      include: this.defaultInclude,
    });

    return {
      message:
        finalStatus === Status.PUBLISHED
          ? 'Visa Checklist published successfully'
          : 'Visa Checklist saved as draft',
      checklist: await this.mapToDto(checklist),
    };
  }

  async edit(id: string, data: EditVisaChecklistInput): Promise<VisaChecklistResponse> {
    const existing = await this.prisma.visaChecklist.findUnique({
      where: { id },
      include: this.defaultInclude,
    });

    if (!existing) throw new HttpException('Visa Checklist not found', 404);
    if (existing.archived && data.archived !== false)
      throw new HttpException('Cannot edit an archived visa checklist (must unarchive first)', 400);

    const finalStatus = data.status ?? existing.status;

    if (finalStatus === Status.PUBLISHED) {
      const currentImages = data.images === undefined
        ? deserializeJsonMedia(existing.images)
        : (data.images ?? []);

      const hasPriceOptionsToUpsert = (data.visaPriceOptionsToUpsert?.length ?? 0) > 0;
      
      const existingPriceOptionsAfterDelete = existing.visaPriceOptions
        .filter(opt => !(data.durationOptionIdsToDelete || []).includes(opt.id));
      const existingPriceOptionCount = existingPriceOptionsAfterDelete.length;

      if (currentImages.length === 0) {
        throw new HttpException('Cover media (images) is required to publish the visa checklist.', 400);
      }

      if (existingPriceOptionCount === 0 && !hasPriceOptionsToUpsert) {
        throw new HttpException('At least one visa duration price option must exist to publish the checklist.', 400);
      }
    }

    let datePublished = existing.datePublished;
    if (finalStatus === Status.PUBLISHED && !existing.datePublished) {
      datePublished = new Date();
    } else if (finalStatus !== Status.PUBLISHED) {
      datePublished = null;
    }

    const imagesJson = serializeJsonMedia(data.images);

    let compressedDescription: string | null | undefined = undefined;
    if (data.description !== undefined) {
      compressedDescription = data.description ? await this.compressionService.compress(data.description) : null;
    }

    const priceOptionsUpsertData = data.visaPriceOptionsToUpsert?.map(option => ({
      where: { id: option.id || 'THIS_IS_A_NEW_RECORD_ID' },
      update: {
        durationInDays: option.durationInDays,
        price: option.price,
      },
      create: {
        durationInDays: option.durationInDays!,
        price: option.price!,
      },
    }));

    const updateData: Prisma.VisaChecklistUpdateInput = {
      ...(data.country !== undefined && { country: data.country }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.highlighted !== undefined && { highlighted: data.highlighted }),

      ...(compressedDescription !== undefined && { description: compressedDescription }),

      status: finalStatus,
      datePublished,

      ...(data.images !== undefined && { images: imagesJson ?? Prisma.JsonNull }),

      archived: data.archived ?? (finalStatus === Status.ARCHIVED ? true : existing.archived),
      ...((finalStatus !== Status.ARCHIVED && data.archived === undefined) && { archived: false }),
    };

    if (data.visaPriceOptionsToUpsert || data.durationOptionIdsToDelete) {
      updateData.visaPriceOptions = {
        ...(priceOptionsUpsertData && { upsert: priceOptionsUpsertData }),
        ...(data.durationOptionIdsToDelete && {
          deleteMany: {
            id: { in: data.durationOptionIdsToDelete },
          },
        }),
      };
    }

    const updated = await this.prisma.visaChecklist.update({
      where: { id },
      data: updateData,
      include: this.defaultInclude,
    });

    return {
      message:
        finalStatus === Status.PUBLISHED
          ? 'Visa Checklist published successfully'
          : 'Visa Checklist updated successfully',
      checklist: await this.mapToDto(updated),
    };
  }

  async changeStatus(id: string, status: Status): Promise<VisaChecklistResponse> {
    const existing = await this.prisma.visaChecklist.findUnique({
      where: { id },
      include: this.defaultInclude
    });
    if (!existing) throw new HttpException('Visa Checklist not found', 404);

    let updateData: Prisma.VisaChecklistUpdateInput = {};
    let message = '';

    switch (status) {
      case Status.HIGHLIGHTED: {
        if (existing.status !== Status.PUBLISHED && existing.status !== Status.HIGHLIGHTED) {
          throw new HttpException('Only published visa checklists can be highlighted', 400);
        }
        if (existing.archived) {
          throw new HttpException('Cannot highlight an archived visa checklist', 400);
        }

        if (existing.status === Status.HIGHLIGHTED) {
          updateData = { highlighted: false, status: Status.PUBLISHED };
          message = 'Visa checklist unhighlighted successfully';
        } else {
          await this.unhighlightAllForModel(); 
          updateData = { highlighted: true, status: Status.HIGHLIGHTED };
          message = 'Visa checklist highlighted successfully';
        }
        break;
      }

      case Status.ARCHIVED: {
        if (existing.status === Status.DRAFT) {
          throw new HttpException('Cannot archive a draft visa checklist.', 400);
        }
        updateData = { archived: true, highlighted: false, status: Status.ARCHIVED };
        message = 'Visa checklist archived successfully';
        break;
      }

      case Status.PUBLISHED: {
        updateData = {
          status: Status.PUBLISHED,
          highlighted: false,
          archived: false,
          datePublished: existing.datePublished ?? new Date(),
        };
        message = 'Visa checklist published successfully';
        break;
      }

      case Status.DRAFT: {
        updateData = {
          status: Status.DRAFT,
          highlighted: false,
          archived: false,
          datePublished: null,
        };
        message = 'Visa checklist saved to draft successfully';
        break;
      }

      default:
        throw new HttpException('Unsupported status transition', 400);
    }

    const updated = await this.prisma.visaChecklist.update({
      where: { id },
      data: updateData,
      include: this.defaultInclude,
    });

    return { message, checklist: await this.mapToDto(updated) };
  }

  async findOne(id: string): Promise<VisaChecklistType> {
    const item = await super.findOne(id);
    return item as VisaChecklistType;
  }

  async delete(id: string): Promise<DeleteVisaChecklistResponse> {
    const existing = await this.prisma.visaChecklist.findUnique({ where: { id } });
    if (!existing) throw new HttpException('Visa Checklist not found', 404);

    await this.prisma.visaChecklist.delete({ where: { id } });
    return { message: 'Visa Checklist deleted successfully' };
  }


  async getHighlightedChecklist(): Promise<VisaChecklistType | null> {
    const checklist = await this.prisma.visaChecklist.findFirst({
      where: { highlighted: true },
      include: this.defaultInclude,
    });
    return checklist ? await this.mapToDto(checklist) : null;
  }

  async getAllPublishedChecklists(): Promise<VisaChecklistType[]> {
    const checklists = await this.prisma.visaChecklist.findMany({
      where: { status: Status.PUBLISHED, archived: false },
      orderBy: { createdAt: 'desc' },
      include: this.defaultInclude,
    });

    return Promise.all(checklists.map(checklist => this.mapToDto(checklist)));
  }

  async findAll(
    filter: VisaChecklistFilterInput,
  ): Promise<PaginatedVisaChecklists> {
    const { status, country, location, dateRangePreset, page = 1, pageSize = 10 } = filter ?? {};

    //Use Utility to process date range preset
    const { startDate, endDate } = dateRangePresetToDates(
      dateRangePreset,
      filter?.startDate,
      filter?.endDate
    );

    const where: Prisma.VisaChecklistWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (country) {
      where.country = { contains: country };
    }

    if (location) {
      where.location = { contains: location };
    }

    //Use Utility to build date condition
    Object.assign(where, buildDateWhere(status, startDate, endDate));

    const total = await this.prisma.visaChecklist.count({ where });

    // Use Utility for pagination
    const { skip, take } = buildPagination(page, pageSize);

    const data = await this.prisma.visaChecklist.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: this.defaultInclude,
    });

    const mappedData = await Promise.all(data.map((d) => this.mapToDto(d)));

    return { data: mappedData, total, page, pageSize };
  }

  async searchVisaCountry(term: string): Promise<VisaChecklistType[]> {
    if (!term || term.trim() === '') return [];
    const searchTrimmed = term.trim();

    const checklists = await this.prisma.visaChecklist.findMany({
      where: {
        OR: [
          { country: { contains: searchTrimmed } },
          { location: { contains: searchTrimmed } },
        ],
      },
      orderBy: { datePublished: 'desc' },
      take: 10,
      include: this.defaultInclude,
    });

    return Promise.all(checklists.map(checklist => this.mapToDto(checklist)));
  }
}