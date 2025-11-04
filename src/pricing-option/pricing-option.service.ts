import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  CreateClientCategoryPriceOptionInput,
  EditClientCategoryPriceOptionInput,
  ClientCategoryPriceOptionResponse,
  PaginatedClientCategoryPriceOptions,
  CreateVisaPriceOptionInput,
  EditVisaPriceOptionInput,
  VisaPriceOptionResponse,
  PaginatedVisaPriceOptions,
  DeletePriceOptionResponse,
  ClientCategoryPriceOptionType,
} from '../dtos/pricing-option.dto';

@Injectable()
export class PricingOptionService {
  constructor(private readonly prisma: PrismaService) {}

  // tour package and destination pricing
  async createClientOption(
    data: CreateClientCategoryPriceOptionInput,
  ): Promise<ClientCategoryPriceOptionResponse> {
    try {
      const newOption = await this.prisma.clientCategoryPriceOption.create({
        data: {
          categoryName: data.categoryName.trim(),
          price: data.price,
        },
      });
      return {
        message: 'Client price option created successfully',
        option: newOption as ClientCategoryPriceOptionType,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new HttpException(
          `Client category name "${data.categoryName}" already exists.`,
          409,
        );
      }
      throw new HttpException('Failed to create client price option', 500);
    }
  }

  async editClientOption(
    id: string,
    data: EditClientCategoryPriceOptionInput,
  ): Promise<ClientCategoryPriceOptionResponse> {
    if (data.categoryName) {
      data.categoryName = data.categoryName.trim();
    }

    try {
      const updatedOption = await this.prisma.clientCategoryPriceOption.update({
        where: { id },
        data: data as any,
      });
      return {
        message: 'Client price option updated successfully',
        option: updatedOption as any,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Client price option not found');
        }
        if (error.code === 'P2002') {
          throw new HttpException(
            `Client category name "${data.categoryName}" already exists.`,
            409,
          );
        }
      }
      throw new HttpException('Failed to update client price option', 500);
    }
  }

  async getAllClientOptions(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedClientCategoryPriceOptions> {
    const total = await this.prisma.clientCategoryPriceOption.count();
    const data = await this.prisma.clientCategoryPriceOption.findMany({
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { data: data as any, total, page, pageSize };
  }

  async deleteClientOption(id: string): Promise<DeletePriceOptionResponse> {
    try {
      await this.prisma.clientCategoryPriceOption.delete({ where: { id } });
      return { message: 'Client price option deleted successfully' };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Client price option not found');
      }
      throw new HttpException('Failed to delete client price option', 500);
    }
  }

  // visa checklist pricing
  async createVisaOption(
    data: CreateVisaPriceOptionInput,
  ): Promise<VisaPriceOptionResponse> {
    try {
      const newOption = await this.prisma.visaDurationPriceOption.create({
        data: data as any,
      });
      return {
        message: 'Visa price option created successfully',
        option: newOption as any,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new HttpException(
          `Visa duration of ${data.durationInDays} days already exists.`,
          409,
        );
      }
      throw new HttpException('Failed to create visa price option', 500);
    }
  }

  async editVisaOption(
    id: string,
    data: EditVisaPriceOptionInput,
  ): Promise<VisaPriceOptionResponse> {
    try {
      const updatedOption = await this.prisma.visaDurationPriceOption.update({
        where: { id },
        data: data as any,
      });
      return {
        message: 'Visa price option updated successfully',
        option: updatedOption as any,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Visa price option not found');
        }
        if (error.code === 'P2002') {
          throw new HttpException(
            `Visa duration of ${data.durationInDays} days already exists.`,
            409,
          );
        }
      }
      throw new HttpException('Failed to update visa price option', 500);
    }
  }

  async getAllVisaOptions(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedVisaPriceOptions> {
    const total = await this.prisma.visaDurationPriceOption.count();
    const data = await this.prisma.visaDurationPriceOption.findMany({
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { data: data as any, total, page, pageSize };
  }

  async deleteVisaOption(id: string): Promise<DeletePriceOptionResponse> {
    try {
      await this.prisma.visaDurationPriceOption.delete({ where: { id } });
      return { message: 'Visa price option deleted successfully' };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Visa price option not found');
      }
      throw new HttpException('Failed to delete visa price option', 500);
    }
  }
}
