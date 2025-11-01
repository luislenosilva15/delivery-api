import { Injectable } from '@nestjs/common';
import { CreateMenuGroupDto } from './dto/create-menu-group.dto';
import { UpdateMenuGroupDto } from './dto/update-menu-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MenuGroupService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createMenuGroupDto: CreateMenuGroupDto) {
    const group = await this.prisma.menuGroup.create({
      data: {
        name: createMenuGroupDto.name,
        menuId: Number(createMenuGroupDto.menuId),
        alwaysAvailable: createMenuGroupDto.alwaysAvailable,
        menuHours: createMenuGroupDto.menuHours
          ? {
              create: createMenuGroupDto.menuHours,
            }
          : undefined,
      },
    });

    return {
      group,
    };
  }

  async findAll(companyId: number) {
    const menuGroups = await this.prisma.menuGroup.findMany({
      where: {
        menu: {
          companyId,
        },
        isDeleted: false,
      },
      orderBy: {
        id: 'desc',
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
      include: {
        menuHours: true,
      },
    });

    return {
      menuGroup,
    };
  }

  async update(id: number, updateMenuGroupDto: UpdateMenuGroupDto) {
    await this.prisma.menuHours.deleteMany({
      where: {
        menuGroupId: id,
      },
    });

    delete updateMenuGroupDto.menuId;

    const group = await this.prisma.menuGroup.update({
      where: {
        id,
      },
      data: {
        name: updateMenuGroupDto.name,
        alwaysAvailable: updateMenuGroupDto.alwaysAvailable,
        disabled: updateMenuGroupDto.disabled,
        menuHours: updateMenuGroupDto.menuHours
          ? {
              create: updateMenuGroupDto.menuHours,
            }
          : undefined,
      },
    });

    return {
      group,
    };
  }

  async remove(id: number) {
    return await this.prisma.menuGroup.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}
