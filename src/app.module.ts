import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OpeningHoursModule } from './opening-hours/opening-hours.module';
import { MenuModule } from './menu/menu.module';
import { MenuGroupModule } from './menu-group/menu-group.module';
import { ProductModule } from './product/product.module';
import { CompanyModule as ClientCompanyModule } from './client/company/company.module';
import { MenuGroupModule as ClientMenuGroupModule } from './client/menu-group/menu-group.module';
import { OrderModule as ClientOrderModule } from './client/order/order.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    CompanyModule,
    UserModule,
    AuthModule,
    OpeningHoursModule,
    MenuModule,
    MenuGroupModule,
    ProductModule,
    ClientCompanyModule,
    ClientMenuGroupModule,
    ClientOrderModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
