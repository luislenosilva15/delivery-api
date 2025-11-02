import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  legalName?: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  paymentDocumentInTicket?: string;

  @IsOptional()
  @IsString()
  paymentRequiredDocument?: string;

  availability: string;

  @IsOptional()
  @IsString()
  paymentMethodAvailable: string;

  @IsOptional()
  @IsString()
  paymentCardBrand: string;

  @IsOptional()
  @IsString()
  paymentDebitCardBrand?: string;

  @IsOptional()
  @IsString()
  paymentVoucherBrand: string;

  @IsString()
  slugName: string;
}
