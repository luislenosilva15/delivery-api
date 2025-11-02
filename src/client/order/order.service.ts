import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const deliveryOrderAddress = createOrderDto?.deliveryAddress ?? undefined;

    const order = await this.prisma.order.create({
      data: {
        deliveryMethod: createOrderDto.deliveryMethod,
        paymentCardBrand: createOrderDto.paymentCardBrand,
        paymentMethod: createOrderDto.paymentMethod,
        paymentDebitCardBrand: createOrderDto.paymentDebitCardBrand,
        paymentVoucherBrand: createOrderDto.paymentVoucherBrand,
        company: { connect: { id: createOrderDto.companyId } },
        totalPrice: createOrderDto.totalPrice,
        client: createOrderDto.client.id
          ? { connect: { id: createOrderDto.client.id } }
          : {
              create: {
                name: createOrderDto.client.name,
                phone: createOrderDto.client.phone,
                company: { connect: { id: createOrderDto.companyId } },
              },
            },
        deliveryAddress: deliveryOrderAddress && {
          create: {
            cep: deliveryOrderAddress.cep,
            street: deliveryOrderAddress.street,
            number: deliveryOrderAddress.number,
            complement: deliveryOrderAddress.complement,
            reference: deliveryOrderAddress?.reference,
          },
        },
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

    return {
      order,
    };
  }

  findAll() {
    return `This action returns all order`;
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
