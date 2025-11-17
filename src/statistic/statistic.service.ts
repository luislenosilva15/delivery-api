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

  async findDashboard(companyId: number) {
    const totalRevenueMonth = await this.prisma.order.aggregate({
      where: {
        companyId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
        status: 'DELIVERED',
      },
      _sum: {
        totalPrice: true,
      },
    });

    const totalOrdersMonth = await this.prisma.order.count({
      where: {
        companyId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
        status: 'DELIVERED',
      },
    });

    const totalNewClientsMonth = await this.prisma.client.count({
      where: {
        companyId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const totalRevenue7Days = await this.prisma.order.aggregate({
      where: {
        companyId,
        createdAt: {
          gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() - 7,
          ),
        },
        status: 'DELIVERED',
      },
      _sum: {
        totalPrice: true,
      },
    });

    const totalOrders7Days = await this.prisma.order.count({
      where: {
        companyId,
        createdAt: {
          gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() - 7,
          ),
        },
        status: 'DELIVERED',
      },
    });

    const totalNewClients7Days = await this.prisma.client.count({
      where: {
        companyId,
        createdAt: {
          gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() - 7,
          ),
        },
      },
    });

    const totalTicketMonth = totalOrdersMonth
      ? Number(totalRevenueMonth._sum.totalPrice || 0) / totalOrdersMonth
      : 0;

    const totalTicket7Days = totalOrders7Days
      ? Number(totalRevenue7Days._sum.totalPrice || 0) / totalOrders7Days
      : 0;

    const getDeliveryMethodPercentages = async () => {
      const grouped = await this.prisma.order.groupBy({
        by: ['deliveryMethod'],
        where: {
          companyId,
          status: 'DELIVERED',
        },
        _count: {
          deliveryMethod: true,
        },
      });

      const totalOrders = grouped.reduce(
        (acc, g) => acc + g._count.deliveryMethod,
        0,
      );

      if (totalOrders === 0) {
        return {
          DELIVERY: 0,
          LOCAL: 0,
        };
      }

      const deliveryCount =
        grouped.find((g) => g.deliveryMethod === 'DELIVERY')?._count
          .deliveryMethod ?? 0;
      const localCount =
        grouped.find((g) => g.deliveryMethod === 'LOCAL')?._count
          .deliveryMethod ?? 0;

      return {
        DELIVERY: Number(((deliveryCount / totalOrders) * 100).toFixed(2)),
        LOCAL: Number(((localCount / totalOrders) * 100).toFixed(2)),
      };
    };

    const deliveryMethodPercentages = await getDeliveryMethodPercentages();

    const last3rders = await this.prisma.order.findMany({
      where: {
        companyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });

    // -------------------------------
    // ORDERS POR DIA DO MÊS (inclui dias futuros = 0)
    // -------------------------------
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const startOfMonth = new Date(year, month, 1);

    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    const ordersByDayRaw = await this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        companyId,
        status: 'DELIVERED',
        createdAt: {
          gte: startOfMonth,
          lte: new Date(year, month, lastDayOfMonth, 23, 59, 59),
        },
      },
      _count: { id: true },
    });

    const orderCountMap = new Map<number, number>();

    ordersByDayRaw.forEach((item) => {
      const day = new Date(item.createdAt).getDate();
      const count = item._count.id;
      orderCountMap.set(day, (orderCountMap.get(day) || 0) + count);
    });

    const ordersPerDay = [];
    for (let day = 1; day <= lastDayOfMonth; day++) {
      ordersPerDay.push({
        day,
        total: orderCountMap.get(day) ?? 0,
      });
    }

    return {
      totalRevenueMonth: totalRevenueMonth._sum.totalPrice || 0,
      totalOrdersMonth,
      totalNewClientsMonth,
      averageTicketMonth: Number(totalTicketMonth.toFixed(2)),
      totalRevenue7Days: totalRevenue7Days._sum.totalPrice || 0,
      totalOrders7Days,
      totalNewClients7Days,
      averageTicket7Days: Number(totalTicket7Days.toFixed(2)),
      deliveryMethodPercentages,
      // last3rders,
      ordersPerDay,
    };
  }
}
