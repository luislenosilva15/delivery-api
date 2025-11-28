import { Injectable } from '@nestjs/common';
import { CreateOptionalDto } from './dto/create-optional.dto';
import { UpdateOptionalDto } from './dto/update-optional.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OptionalsService {
  constructor(private prisma: PrismaService) {}

  async create(createOptionalDto: CreateOptionalDto) {
    const { options, ...optionalData } = createOptionalDto;
    const optional = await this.prisma.optional.create({
      data: {
        ...optionalData,
        options: options ? { create: options } : undefined,
      },
    });
    return { optional };
  }

  findAll() {
    return `This action returns all optionals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} optional`;
  }

  update(id: number, updateOptionalDto: UpdateOptionalDto) {
    return `This action updates a #${id} optional`;
  }

  remove(id: number) {
    return `This action removes a #${id} optional`;
  }
}
