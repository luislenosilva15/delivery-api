import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(status: OrderStatus, companyId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        status,
        companyId,
      },
      include: {
        client: true,
      },
    });

    return {
      orders,
    };
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        client: true,
        deliveryAddress: true,
        OrderItem: {
          include: { product: true },
        },
      },
    });

    return {
      order,
    };
  }

  update(id: number, updateOrderDto: any) {
    return `This action returns a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async findCount(companyId: number) {
    const total = await this.prisma.order.groupBy({
      by: ['status'],
      where: {
        companyId,
      },
      _count: {
        status: true,
      },
    });
    return {
      total,
    };
  }

  async changeStatus(orderId: number, status: OrderStatus) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return {
      order,
    };
  }
}
