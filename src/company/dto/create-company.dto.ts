import { IsEmail, IsOptional, IsString } from 'class-validator';

export type Availability = ['DELIVERY' | 'LOCAL'];

export type PaymentMethod = [
  'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'CASH' | 'VOUCHER',
];

export type PaymentCardBrand = [
  'VISA' | 'MASTERCARD' | 'AMEX' | 'ELO' | 'HIPERCARD' | 'OTHER',
];

export type PaymentVoucherBrand = [
  'ALELO' | 'SODEXO' | 'VR' | 'OTHER' | 'BEN' | 'VEROCHEQUE',
];

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

  availability: string;

  paymentMethodAvailable: string;

  paymentCardBrand: string;

  paymentVoucherBrand: string;
}
