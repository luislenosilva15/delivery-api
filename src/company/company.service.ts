/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Availability,
  CreateCompanyDto,
  PaymentCardBrand,
  PaymentMethod,
  PaymentVoucherBrand,
} from './dto/create-company.dto';
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

    const availability: Availability = JSON.parse(
      createCompanyDto.availability,
    );

    const paymentMethodAvailable: PaymentMethod = JSON.parse(
      createCompanyDto.paymentMethodAvailable,
    );

    const paymentCardBrand: PaymentCardBrand = JSON.parse(
      createCompanyDto.paymentCardBrand,
    );

    const paymentVoucherBrand: PaymentVoucherBrand = JSON.parse(
      createCompanyDto.paymentVoucherBrand,
    );

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
        availability,
        paymentMethodAvailable,
        paymentCardBrand,
        paymentVoucherBrand,
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
    let availability: Availability;
    let paymentMethodAvailable: PaymentMethod;
    let paymentCardBrand: PaymentCardBrand;
    let paymentVoucherBrand: PaymentVoucherBrand;

    if (updateCompanyDto?.availability.length) {
      availability = JSON.parse(updateCompanyDto?.availability);
    }

    if (updateCompanyDto?.paymentMethodAvailable.length) {
      paymentMethodAvailable = JSON.parse(
        updateCompanyDto?.paymentMethodAvailable,
      );
    }

    if (updateCompanyDto?.paymentCardBrand.length) {
      paymentCardBrand = JSON.parse(updateCompanyDto?.paymentCardBrand);
    }

    if (updateCompanyDto?.paymentVoucherBrand.length) {
      paymentVoucherBrand = JSON.parse(updateCompanyDto?.paymentVoucherBrand);
    }

    const company = {
      ...updateCompanyDto,
      availability,
      paymentMethodAvailable,
      paymentCardBrand,
      paymentVoucherBrand,
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
        availability: updateCompanyDto?.availability && availability,
      },
    });

    return {
      company: companyFormaterHelper(editedCompany),
    };
  }

  remove(id: number) {}
}
