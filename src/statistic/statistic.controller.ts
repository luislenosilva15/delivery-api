import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('statistic')
@UseGuards(JwtAuthGuard)
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('/clients')
  findAll(
    @Req() req: JwtPayload,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('sortBy')
    sortBy?: 'name' | 'createdAt' | 'orders' | 'firstOrder' | 'lastOrder',
  ) {
    return this.statisticService.findAllClients(Number(req.user.companyId), {
      search,
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      sortBy,
    });
  }

  @Get('/sales')
  findOne(
    @Req() req: JwtPayload,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('includeRejected') includeRejected?: string,
  ) {
    return this.statisticService.findSales(+req.user.companyId, {
      limit: Number(limit),
      page: Number(page),
      startDate,
      endDate,
      includeRejected: Boolean(includeRejected === 'true'),
    });
  }

  @Get('/sales/:orderId')
  findOrderDetails(@Param('orderId') orderId: string) {
    console.log('Fetching details for orderId:', orderId);
    return this.statisticService.findSale(+orderId);
  }
}
