import { Injectable } from '@nestjs/common';
import { CreateOpeningHourDto } from './dto/create-opening-hour.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOpeningHourDto } from './dto/update-opening-hour.dto';

@Injectable()
export class OpeningHoursService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, data: CreateOpeningHourDto[]) {
    await this.prisma.openingHour.createMany({
      data: data.map((item) => ({
        companyId: Number(companyId),
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        closed: item.closed,
      })),
    });

    return this.prisma.company.update({
      where: {
        id: Number(companyId),
      },
      include: {
        openingHours: true,
      },
      data: {
        isAlwaysOpening: false,
      },
    });
  }

  async update(companyId: string, data: UpdateOpeningHourDto[]) {
    await this.prisma.openingHour.deleteMany({
      where: {
        companyId: Number(companyId),
      },
    });

    await this.prisma.openingHour.createMany({
      data: data.map((item) => ({
        companyId: Number(companyId),
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        closed: item.closed,
      })),
    });

    const company = await this.prisma.company.update({
      where: {
        id: Number(companyId),
      },
      include: {
        openingHours: true,
      },
      data: {
        isAlwaysOpening: false,
      },
    });

    return company.openingHours;
  }

  findAll(companyId: string) {
    return this.prisma.openingHour.findMany({
      where: {
        companyId: Number(companyId),
      },
    });
  }

  async alwaysOpen(companyId: string) {
    await this.prisma.openingHour.deleteMany({
      where: {
        companyId: Number(companyId),
      },
    });

    return await this.prisma.company.update({
      where: {
        id: Number(companyId),
      },
      data: {
        isAlwaysOpening: true,
      },
    });
  }

  async temporaryClosed(companyId: string, closed: boolean) {
    return await this.prisma.company.update({
      where: {
        id: Number(companyId),
      },
      select: {
        temporaryClosed: true,
      },
      data: {
        temporaryClosed: !closed,
      },
    });
  }

  remove(companyId: string) {
    return this.prisma.openingHour.deleteMany({
      where: {
        companyId: Number(companyId),
      },
    });
  }
}
