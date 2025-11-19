import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { OpenRouteServiceClient } from 'src/maps/openroute.service';

@Module({
  controllers: [CompanyController],
  providers: [
    CompanyService,
    PrismaService,
    StorageService,
    OpenRouteServiceClient,
  ],
})
export class CompanyModule {}
