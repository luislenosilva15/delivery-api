import { PartialType } from '@nestjs/mapped-types';
import { CreateOptionalDto } from './create-optional.dto';

export class UpdateOptionalDto extends PartialType(CreateOptionalDto) {}
