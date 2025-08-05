import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, StorageService],
})
export class UserModule {}
