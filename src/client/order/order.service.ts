import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        deliveryMethod: createOrderDto.deliveryMethod,
        paymentCardBrand: createOrderDto.paymentCardBrand,
        paymentMethod: createOrderDto.paymentMethod,
        paymentDebitCardBrand: createOrderDto.paymentDebitCardBrand,
        paymentVoucherBrand: createOrderDto.paymentVoucherBrand,
        company: { connect: { id: createOrderDto.companyId } },
        totalPrice: createOrderDto.totalPrice,
        client: {
          connectOrCreate: {
            where: { id: createOrderDto.client.id ?? 0 },
            create: {
              name: createOrderDto.client.name,
              phone: createOrderDto.client.phone,
              company: { connect: { id: createOrderDto.companyId } },
            },
          },
        },
        OrderItem: {
          create: createOrderDto.products.map((product) => ({
            product: { connect: { id: product.productId } },
            quantity: product.quantity,
            price: product.price,
          })),
        },
      },
    });
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
