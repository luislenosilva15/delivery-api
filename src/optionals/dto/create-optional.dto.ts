import { OptionalType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOptionalDto {
  @IsString()
  name: string;

  @IsEnum(OptionalType)
  type: OptionalType;

  @IsString()
  @IsOptional()
  code?: string;

  @IsOptional()
  price?: number;

  @IsOptional()
  @IsInt()
  minSelections?: number;

  @IsOptional()
  @IsInt()
  maxSelections?: number;

  @IsInt()
  menuId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  options?: Array<{
    name: string;
    price: number;
    code?: string;
  }>;
}
