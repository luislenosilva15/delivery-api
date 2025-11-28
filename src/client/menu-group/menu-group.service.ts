import { Injectable } from '@nestjs/common';
import { productFormaterHelper } from 'src/helpers/product-formater-helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MenuGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(menuId: number) {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);

    const groups = await this.prisma.menuGroup.findMany({
      where: {
        menuId,
        disabled: false,
        isDeleted: false,
        products: {
          some: {
            id: {
              not: undefined,
            },
            AND: {
              OR: [
                { alwaysAvailable: true, disabled: false },
                {
                  productHours: {
                    some: {
                      closed: false,
                      dayOfWeek,
                      startTime: { lte: currentTime },
                      endTime: { gte: currentTime },
                    },
                  },
                },
              ],
            },
          },
        },
        OR: [
          { alwaysAvailable: true },
          {
            menuHours: {
              some: {
                closed: false,
                dayOfWeek,
                startTime: { lte: currentTime },
                endTime: { gte: currentTime },
              },
            },
          },
        ],
      },
      include: {
        products: {
          where: {
            isDeleted: false,
            disabled: false,
            OR: [
              { alwaysAvailable: true },
              {
                productHours: {
                  some: {
                    closed: false,
                    dayOfWeek,
                    startTime: { lte: currentTime },
                    endTime: { gte: currentTime },
                  },
                },
              },
            ],
          },
          orderBy: {
            name: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formatedGroups = groups.map((group) => ({
      ...group,
      products: group.products.map((product) => productFormaterHelper(product)),
    }));

    return {
      groups: formatedGroups,
    };
  }
}
