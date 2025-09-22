import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { OrderStatus } from '@prisma/client';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/count')
  findCount(@Req() req: JwtPayload) {
    return this.orderService.findCount(+req.user.companyId);
  }

  @Get(':status')
  findAll(@Param('status') status: OrderStatus, @Req() req: JwtPayload) {
    return this.orderService.findAll(status, +req.user.companyId);
  }

  @Get('/unique/:id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
