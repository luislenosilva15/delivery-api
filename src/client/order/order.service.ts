import { Injectable } from '@nestjs/common';
import { SocketService } from 'src/common/socket/socket.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private readonly socketService: SocketService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const deliveryOrderAddress = createOrderDto?.deliveryAddress;

    const existingClient = await this.prisma.client.findFirst({
      where: { phone: createOrderDto.client.phone },
    });

    const clientData = existingClient
      ? { connect: { id: existingClient.id } }
      : {
          create: {
            name: createOrderDto.client.name,
            phone: createOrderDto.client.phone,
            company: { connect: { id: createOrderDto.companyId } },
          },
        };

    const order = await this.prisma.order.create({
      data: {
        deliveryMethod: createOrderDto.deliveryMethod,
        paymentCardBrand: createOrderDto.paymentCardBrand,
        paymentMethod: createOrderDto.paymentMethod,
        paymentDebitCardBrand: createOrderDto.paymentDebitCardBrand,
        paymentVoucherBrand: createOrderDto.paymentVoucherBrand,
        company: { connect: { id: createOrderDto.companyId } },
        totalPrice: createOrderDto.totalPrice,
        client: clientData,
        deliveryAddress: deliveryOrderAddress
          ? {
              create: {
                cep: deliveryOrderAddress.cep,
                street: deliveryOrderAddress.street,
                number: deliveryOrderAddress.number,
                complement: deliveryOrderAddress.complement,
                reference: deliveryOrderAddress?.reference,
              },
            }
          : undefined,
        OrderItem: {
          create: createOrderDto.products.map((product) => ({
            product: { connect: { id: product.productId } },
            quantity: product.quantity,
            price: product.price,
            observation: product.observation,
          })),
        },
      },
      include: {
        client: true,
        OrderItem: { include: { product: true } },
      },
    });

    try {
      this.socketService.emitToCompany(order.companyId, 'new-order', order);
    } catch {
      // LOG
    }

    return { order };
  }

  findAll(clientId: number, companyId: number) {
    const orders = this.prisma.order.findMany({
      where: {
        clientId,
        companyId,
      },
      include: {
        client: true,
        OrderItem: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return orders;
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        client: true,
        OrderItem: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      order,
    };
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
