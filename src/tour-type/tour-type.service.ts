import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTourTypeInput, EditTourTypeInput } from 'src/dtos/tour-type.dto';

@Injectable()
export class TourTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async createTourType(data: CreateTourTypeInput) {
    const created = await this.prisma.tourType.create({ data });
    return created;
  }

  async getAllTourTypes() {
    return this.prisma.tourType.findMany({ orderBy: { name: 'asc' } });
  }

  async editTourType(id: string, data: EditTourTypeInput) {
    const existing = await this.prisma.tourType.findUnique({ where: { id } });
    if (!existing) throw new HttpException('Tour type not found', 404);
    const updated = await this.prisma.tourType.update({ where: { id }, data });
    return updated;
  }

  async deleteTourType(id: string) {
    const existing = await this.prisma.tourType.findUnique({ where: { id } });
    if (!existing) throw new HttpException('Tour type not found', 404);
    await this.prisma.tourType.delete({ where: { id } });
    return 'Tour type deleted successfully';
  }
}
