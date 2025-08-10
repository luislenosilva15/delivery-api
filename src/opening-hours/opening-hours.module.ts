import { Module } from '@nestjs/common';
import { OpeningHoursService } from './opening-hours.service';
import { OpeningHoursController } from './opening-hours.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [OpeningHoursController],
  providers: [OpeningHoursService, PrismaService],
})
export class OpeningHoursModule {}
