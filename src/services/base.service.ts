import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Generic BaseService providing common CRUD operations using Prisma and strictly using DTOs
 * @template Model - Prisma model type
 * @template CreateDto - DTO type for creation
 * @template UpdateDto - DTO type for updates
 */
@Injectable() 
export class BaseService<
  Model extends { id: string },
  CreateDto,
  UpdateDto
> {
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly modelDelegate: {
      findMany: (args?: any) => Promise<Model[]>;
      findUnique: (args: any) => Promise<Model | null>;
      create: (args: any) => Promise<Model>;
      update: (args: any) => Promise<Model>;
      delete: (args: any) => Promise<Model>;
      count?: (args?: any) => Promise<number>;
    }
  ) {}

  /** Fetch all records, with optional filters, pagination, and sorting */
  async findAll(options?: any): Promise<Model[]> {
    return this.modelDelegate.findMany(options);
  }

  /** Fetch a single record by unique identifier */
  async findOne(id: string): Promise<Model> {
    const record = await this.modelDelegate.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Record with id ${id} not found`);
    }
    return record;
  }

  /** Create a new record using CreateDto */
  async create(data: CreateDto): Promise<Model> {
    return this.modelDelegate.create({ data });
  }

  /** Update existing record by id using UpdateDto */
  async update(id: string, data: UpdateDto): Promise<Model> {
    await this.findOne(id);
    return this.modelDelegate.update({ where: { id }, data });
  }

  /** Delete record by id */
  async remove(id: string): Promise<Model> {
    await this.findOne(id);
    return this.modelDelegate.delete({ where: { id } });
  }

  /** Count records with optional filters */
  async count(options?: any): Promise<number> {
    if (!this.modelDelegate.count) return 0;
    return this.modelDelegate.count(options);
  }
}