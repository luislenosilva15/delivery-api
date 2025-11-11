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
      sortBy = 'createdAt',
    }: {
      search?: string;
      lastOrderDays?: number;
      skip?: number;
      limit?: number;
      sortBy?: 'name' | 'createdAt' | 'orders' | 'firstOrder' | 'lastOrder';
    },
  ) {
    const newOrder = {
      orders: {
        orders: {
          _count: 'desc',
        },
      },
      createdAt: { createdAt: 'asc' },
    };
    const clientsData = await this.prisma.client.findMany({
      where: {
        companyId,
        ...(search && {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        }),
      },
      skip,
      take: limit,
      orderBy: newOrder[sortBy],
      include: {
        orders: {
          select: {
            createdAt: true,
            totalPrice: true,
          },
        },
      },
    });

    const totalItems = await this.prisma.client.count({
      where: {
        companyId,
        ...(search && {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        }),
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const clients = clientsData.map((client) => {
      return {
        id: client.id,
        name: client.name,
        createdAt: client.createdAt,
        ordersCount: client.orders.length,
        email: client.email,
        phone: client.phone,
        firstOrderDate: client.orders.length
          ? client.orders.reduce((prev, curr) =>
              prev.createdAt < curr.createdAt ? prev : curr,
            ).createdAt
          : null,
        lastOrderDate: client.orders.length
          ? client.orders.reduce((prev, curr) =>
              prev.createdAt > curr.createdAt ? prev : curr,
            ).createdAt
          : null,
        totalSpent: client.orders.reduce(
          (sum, order) => sum + order.totalPrice,
          0,
        ),
      };
    });
    return {
      clients,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: Math.floor(skip / limit) + 1,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} statistic`;
  }
}
