import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, StorageService, PrismaService],
})
export class ProductModule {}
