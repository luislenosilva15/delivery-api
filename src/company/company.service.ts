import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { companyFormaterHelper } from 'src/helpers/company-formater-helper';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, image: Express.Multer.File) {
    if (createCompanyDto.email) {
      const existing = await this.prisma.company.findUnique({
        where: {
          email: createCompanyDto.email,
        },
      });

      if (existing) {
        throw new ConflictException('Já existe uma empresa com este e-mail.');
      }
    }

    const imageUrlData = await this.storageService.upload(
      'company',
      image,
      image.originalname,
    );

    if (!imageUrlData?.path) {
      throw new InternalServerErrorException('Erro ao salvar imagem');
    }

    const company = await this.prisma.company.create({
      data: {
        ...createCompanyDto,
        logoUrl: imageUrlData.path,
        openingHours: {
          create: [
            {
              dayOfWeek: 0,
              startTime: '12:00',
              endTime: '14:00',
              closed: false,
            },
            {
              dayOfWeek: 0,
              startTime: '13:00',
              endTime: '19:00',
              closed: false,
            },
            {
              dayOfWeek: 1,
              startTime: '08:00',
              endTime: '12:00',
              closed: false,
            },
            {
              dayOfWeek: 2,
              startTime: null,
              endTime: null,
              closed: true,
            },
            {
              dayOfWeek: 3,
              startTime: null,
              endTime: null,
              closed: true,
            },
            {
              dayOfWeek: 4,
              startTime: null,
              endTime: null,
              closed: true,
            },
            {
              dayOfWeek: 5,
              startTime: null,
              endTime: null,
              closed: true,
            },
            {
              dayOfWeek: 6,
              startTime: null,
              endTime: null,
              closed: true,
            },
          ],
        },
      },
    });

    return company;
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
    image: Express.Multer.File,
  ) {
    const company = {
      ...updateCompanyDto,
    };

    if (image) {
      const companyDb = await this.prisma.company.findUnique({
        where: {
          id,
        },
        select: {
          logoUrl: true,
        },
      });

      const path = companyDb.logoUrl?.split('/').pop();

      await this.storageService.delete('company', path);

      const newImage = await this.storageService.upload(
        'company',
        image,
        image.originalname,
      );

      if (!newImage?.path) {
        throw new InternalServerErrorException('Erro ao salvar imagem');
      }

      company.logoUrl = newImage.path;
    }

    const editedCompany = await this.prisma.company.update({
      where: {
        id,
      },
      data: {
        ...company,
      },
    });

    return {
      company: companyFormaterHelper(editedCompany),
    };
  }

  remove(id: number) {}
}
