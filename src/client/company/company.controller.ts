import { Controller, Get, Param } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('client/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }
}
