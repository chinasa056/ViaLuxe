import { NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client'; 
import { PrismaService } from 'src/prisma/prisma.service';

export abstract class BaseContentService {
    protected constructor(protected readonly prisma: PrismaService) {}

    protected abstract get model(): any; 
    protected abstract get defaultInclude(): any | undefined;
    protected abstract mapToDto(record: any): any;

    protected async unhighlightAllForModel(): Promise<void> {
        await this.model.updateMany({
            where: { highlighted: true },
            data: { highlighted: false, status: Status.PUBLISHED },
        });
    }

    async findOne(id: string) {
        const item = await this.model.findUnique({
            where: { id },
            include: this.defaultInclude,
        });
        if (!item) throw new NotFoundException('Item not found');
        return this.mapToDto(item);
    }
}