import { Injectable } from '@nestjs/common';
import { CreateMenuGroupDto } from './dto/create-menu-group.dto';
import { UpdateMenuGroupDto } from './dto/update-menu-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MenuGroupService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createMenuGroupDto: CreateMenuGroupDto) {
    return await this.prisma.menuGroup.create({
      data: {
        name: createMenuGroupDto.name,
        menuId: Number(createMenuGroupDto.menuId),
      },
    });
  }

  async findAll(companyId: number) {
    const menuGroups = await this.prisma.menuGroup.findMany({
      where: {
        menu: {
          companyId,
        },
      },
    });

    return {
      menuGroups,
    };
  }

  async findOne(id: number) {
    const menuGroup = await this.prisma.menuGroup.findUnique({
      where: {
        id,
      },
    });

    return {
      menuGroup,
    };
  }

  async update(id: number, updateMenuGroupDto: UpdateMenuGroupDto) {
    return await this.prisma.menuGroup.update({
      where: {
        id,
      },
      data: {
        name: updateMenuGroupDto.name,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.menuGroup.delete({
      where: {
        id,
      },
    });
  }
}
