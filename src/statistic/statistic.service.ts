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
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              phone: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
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

  async findSales(
    companyId: number,
    filters: {
      page: number;
      limit: number;
      startDate?: string;
      endDate?: string;
      includeRejected: boolean;
    },
  ) {
    const { page, limit, startDate, endDate, includeRejected } = filters;

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const dateFilter =
      start && end
        ? {
            gte: new Date(
              Date.UTC(
                start.getUTCFullYear(),
                start.getUTCMonth(),
                start.getUTCDate(),
                0,
                0,
                0,
                0,
              ),
            ),
            lte: new Date(
              Date.UTC(
                end.getUTCFullYear(),
                end.getUTCMonth(),
                end.getUTCDate(),
                23,
                59,
                59,
                999,
              ),
            ),
          }
        : undefined;

    const orders = await this.prisma.order.findMany({
      where: {
        companyId,
        ...(includeRejected ? {} : { status: { not: 'CANCELLED' } }),
        ...(dateFilter ? { createdAt: dateFilter } : {}),
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const totalOrders = await this.prisma.order.count({
      where: {
        companyId,
        ...(includeRejected ? {} : { status: { not: 'CANCELLED' } }),
        ...(dateFilter ? { createdAt: dateFilter } : {}),
      },
    });

    const totalSelerResult = await this.prisma.order.aggregate({
      where: {
        companyId,
        ...(dateFilter ? { createdAt: dateFilter } : {}),
      },
      _sum: {
        totalPrice: true,
      },
    });

    const totalSeler = totalSelerResult._sum.totalPrice || 0;

    return {
      sales: orders,
      totalSales: totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      totalSeler,
      averageTicket: totalOrders
        ? Number(totalSeler / totalOrders).toFixed(2)
        : 0,
    };
  }

  async findSale(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        OrderItem: true,
      },
    });

    return {
      sale: order,
    };
  }
}
