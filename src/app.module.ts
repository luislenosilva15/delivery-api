import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OpeningHoursModule } from './opening-hours/opening-hours.module';

@Module({
  imports: [CompanyModule, UserModule, AuthModule, OpeningHoursModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
