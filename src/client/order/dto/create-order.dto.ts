import {
  IsArray,
  ArrayNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  AvailabilityStatus,
  PaymentMethods,
  PaymentCardBrand,
  PaymentDebitCardBrand,
  PaymentVoucherBrand,
} from '@prisma/client';

class ClientDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class DeliveryAddressDto {
  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsOptional()
  @IsString()
  reference?: string;
}

class OrderItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  observation?: string;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  products: OrderItemDto[];

  @IsInt()
  companyId: number;

  @ValidateNested()
  @Type(() => ClientDto)
  client: ClientDto;

  @IsEnum(AvailabilityStatus)
  deliveryMethod: AvailabilityStatus;

  @IsEnum(PaymentMethods)
  paymentMethod: PaymentMethods;

  @IsOptional()
  @IsEnum(PaymentCardBrand)
  paymentCardBrand?: PaymentCardBrand;

  @IsOptional()
  @IsEnum(PaymentDebitCardBrand)
  paymentDebitCardBrand?: PaymentDebitCardBrand;

  @IsOptional()
  @IsEnum(PaymentVoucherBrand)
  paymentVoucherBrand?: PaymentVoucherBrand;

  @IsNumber()
  totalPrice: number;

  deliveryAddress: DeliveryAddressDto;

  @IsOptional()
  @IsString()
  documentInTicket?: string;
}
