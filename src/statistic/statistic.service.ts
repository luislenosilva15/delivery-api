/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatisticService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllClients(
    companyId: number,
    {
      search,
      skip = 0,
      limit = 10,
      sortBy = 'createdAt', // 👈 padrão
      sortOrder = 'desc', // 👈 asc | desc
    }: {
      search?: string;
      lastOrderDays?: number;
      skip?: number;
      limit?: number;
      sortBy?: 'name' | 'createdAt' | 'orders' | 'firstOrder' | 'lastOrder';
      sortOrder?: 'asc' | 'desc';
    },
  ) {
    let clientIdsFilter: number[] | undefined;

    const baseWhere: any = {
      companyId,
      OR: [
        { name: { contains: search || '', mode: 'insensitive' } },
        { phone: { contains: search || '', mode: 'insensitive' } },
      ],
    };

    if (clientIdsFilter && clientIdsFilter.length > 0) {
      baseWhere.id = { in: clientIdsFilter };
    }

    // ⚙️ Define a ordenação dinamicamente
    let orderBy: any = { createdAt: 'desc' };

    if (sortBy === 'name') {
      orderBy = { name: sortOrder };
    } else if (sortBy === 'createdAt') {
      orderBy = { createdAt: sortOrder };
    } else if (sortBy === 'orders') {
      orderBy = {
        orders: {
          _count: sortOrder,
        },
      };
    } else if (sortBy === 'firstOrder') {
      orderBy = {
        orders: {
          _min: {
            createdAt: sortOrder,
          },
        },
      };
    } else if (sortBy === 'lastOrder') {
      orderBy = {
        orders: {
          _max: {
            createdAt: sortOrder,
          },
        },
      };
    }

    // 🔄 Busca clientes
    const [data, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        where: baseWhere,
        skip,
        take: limit,
        orderBy,
        include: {
          _count: { select: { orders: true } },
          orders: {
            where: { companyId },
            select: { createdAt: true, totalPrice: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      this.prisma.client.count({ where: baseWhere }),
    ]);

    return {
      clients: data,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} statistic`;
  }
}
