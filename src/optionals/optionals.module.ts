import { Module } from '@nestjs/common';
import { OptionalsService } from './optionals.service';
import { OptionalsController } from './optionals.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [OptionalsController],
  providers: [OptionalsService, PrismaService],
})
export class OptionalsModule {}
