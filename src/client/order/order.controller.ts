import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ClientOrJwtGuard } from 'src/common/guards/client-or-jwt.guard';

@Controller('client/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get(':clientId/company/:companyId')
  findAll(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return this.orderService.findAll(clientId, companyId);
  }

  @Get('/lastOrder')
  @UseGuards(ClientOrJwtGuard)
  findLastOrder(@Req() req: Request & { user?: { id: string } }) {
    const clientId = ClientOrJwtGuard.extractClientId(req);

    return this.orderService.findLastOrder(clientId);
  }

  @Get(':id')
  @UseGuards(ClientOrJwtGuard)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
