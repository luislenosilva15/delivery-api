import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsOptional } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @IsOptional()
  availability: string;

  @IsOptional()
  paymentMethodAvailable: string;

  @IsOptional()
  paymentCardBrand: string;

  @IsOptional()
  paymentVoucherBrand: string;
}
