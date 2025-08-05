import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  companyId: number;
}
