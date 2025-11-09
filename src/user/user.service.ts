import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import * as bcrypt from 'bcrypt';
import { StorageService } from 'src/storage/storage.service';
import { userFormaterHelper } from 'src/helpers/user-formater-helper';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    image: Express.Multer.File,
    companyId: number,
  ) {
    const saltRounds = 10;

    if (createUserDto.password) {
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );

      createUserDto.password = hashedPassword;
    }

    const imageUrlData =
      image &&
      (await this.storageService.upload('user', image, image.originalname));

    const hasUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (hasUser) {
      throw new BadRequestException('Já existe um usuário com este e-mail.');
    }

    const user = {
      ...createUserDto,
      companyId,
      imageUrl: imageUrlData?.path || null,
    };

    const userData = await this.prisma.user.create({ data: user });

    return {
      ...userFormaterHelper(userData),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    image: Express.Multer.File,
  ) {
    const user = {
      ...updateUserDto,
    };

    const hasRemoveImage = user.removeImage;

    delete user.removeImage;

    if (typeof updateUserDto.isActive === 'string') {
      user.isActive = updateUserDto.isActive === 'true';

      if (!user.isActive) {
        const adminCount = await this.prisma.user.count({
          where: {
            companyId: (
              await this.prisma.user.findUnique({
                where: { id },
                select: { companyId: true },
              })
            )?.companyId,
            role: 'ADMIN',
            isActive: true,
            id: { not: id },
          },
        });

        if (!adminCount) {
          throw new ConflictException(
            'Necessário pelo menos um administrador ativo',
          );
        }
      }
    }

    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    if (image || hasRemoveImage) {
      const userDb = await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          imageUrl: true,
        },
      });

      const path = userDb.imageUrl?.split('/').pop();

      if (userDb.imageUrl && !hasRemoveImage && path) {
        await this.storageService.delete('user', path);
      } else {
        if (hasRemoveImage) {
          await this.storageService.delete('user', path);

          user.imageUrl = null;
        }
      }

      if (!hasRemoveImage) {
        const newImage = await this.storageService.upload(
          'user',
          image,
          image.originalname,
        );

        user.imageUrl = newImage.path;
      }
    }

    const editedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: user,
    });

    return {
      user: userFormaterHelper(editedUser),
    };
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (user) {
      const adminCount = await this.prisma.user.count({
        where: {
          companyId: (
            await this.prisma.user.findUnique({
              where: { id },
              select: { companyId: true },
            })
          )?.companyId,
          role: 'ADMIN',
          id: { not: id },
        },
      });

      if (!adminCount) {
        throw new ConflictException('Necessário pelo menos um administrador');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async findAll(companyId: number, page = 1, search?: string, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: {
          companyId,
          name: { contains: search || '', mode: 'insensitive' },
          isDeleted: false,
        },
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.user.count({
        where: {
          companyId,
          isDeleted: false,
          name: { contains: search || '', mode: 'insensitive' },
        },
      }),
    ]);

    return {
      users: data.map((user) => userFormaterHelper(user)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
