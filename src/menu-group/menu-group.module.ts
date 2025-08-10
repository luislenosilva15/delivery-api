import { Module } from '@nestjs/common';
import { MenuGroupService } from './menu-group.service';
import { MenuGroupController } from './menu-group.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MenuGroupController],
  providers: [MenuGroupService, PrismaService],
})
export class MenuGroupModule {}
