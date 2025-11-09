import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketService } from 'src/common/socket/socket.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketService,
  ) {}

  async findAll(status: OrderStatus, companyId: number) {
    const isDelivery = status === OrderStatus.DELIVERED;

    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        status,
        companyId,
        createdAt: isDelivery
          ? {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lte: new Date(new Date().setHours(23, 59, 59, 999)),
            }
          : undefined,
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
    const outDeliveryStatus = status === OrderStatus.OUT_FOR_DELIVERY;

    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status, outDeliveryDate: outDeliveryStatus ? new Date() : null },
      include: { client: true },
    });

    // Emit to the specific client
    this.socketService.emitToClient(order.clientId, 'order-status-changed', {
      orderId: order.id,
    });

    return {
      order,
    };
  }
}
