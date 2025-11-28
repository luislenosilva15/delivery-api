import {
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryFeeType } from '@prisma/client';

class DeliveryFeeTierDto {
  @IsOptional()
  id?: number;

  @IsNumber()
  maxKm: number;

  @IsNumber()
  price: number;

  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @IsOptional()
  @IsNumber()
  estimatedTime?: number;
}

export class FeesUpdateDto {
  @IsBoolean()
  isFree: boolean;

  @IsEnum(DeliveryFeeType)
  type: DeliveryFeeType;

  @IsOptional()
  @IsNumber()
  fixedFee?: number;

  @IsOptional()
  @IsNumber()
  estimatedTime?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliveryFeeTierDto)
  tiers?: DeliveryFeeTierDto[];
}
