import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientOrJwtGuard } from 'src/common/guards/client-or-jwt.guard';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, ClientOrJwtGuard],
})
export class OrderModule {}
