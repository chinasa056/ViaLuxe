import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
    CreateEmailSubscriberInput,
    EmailSubscriberType,
    EmailSubscriberResponse,
    PaginatedEmailSubscribers,
} from '../dtos/email-subscriber.dto';

@Injectable()
export class EmailSubscriberService {
    constructor(private readonly prisma: PrismaService) {}

    private mapToDto(subscriber: any): EmailSubscriberType {
        return subscriber as EmailSubscriberType;
    }

    async collect(data: CreateEmailSubscriberInput): Promise<EmailSubscriberResponse> {
        try {
            const newSubscriber = await this.prisma.emailSubscriber.create({
                data: {
                    email: data.email.toLowerCase(),
                },
            });

            return {
                message: 'Thank you for subscribing! Your email has been added.',
                subscriber: this.mapToDto(newSubscriber),
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new HttpException('This email is already subscribed.', 409);
            }
            throw new HttpException('An unexpected error occurred during subscription.', 500);
        }
    }

    async getAllSubscribers(page: number = 1, pageSize: number = 10): Promise<PaginatedEmailSubscribers> {
        const total = await this.prisma.emailSubscriber.count();

        const data = await this.prisma.emailSubscriber.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            data: data.map(this.mapToDto),
            total,
            page,
            pageSize,
        };
    }

    async searchSubscribers(term: string): Promise<EmailSubscriberType[]> {
        if (!term || term.trim() === '') return [];

        const subscribers = await this.prisma.emailSubscriber.findMany({
            where: {
                email: {
                    contains: term.trim().toLowerCase(),
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });

        return subscribers.map(this.mapToDto);
    }
}