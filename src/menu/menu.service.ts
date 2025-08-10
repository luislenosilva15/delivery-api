/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  create(companyId: number) {
    return this.prisma.menu.create({
      data: {
        companyId,
      },
    });
  }

  findAll(companyId: number) {
    return this.prisma.menu.findMany({
      where: {
        companyId,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.menu.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return this.prisma.menu.delete({
      where: {
        id,
      },
    });
  }
}
