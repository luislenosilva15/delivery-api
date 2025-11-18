/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { companyFormaterHelper } from 'src/helpers/company-formater-helper';
import {
  Availability,
  PaymentCardBrand,
  PaymentDebitCardBrand,
  PaymentMethod,
  PaymentVoucherBrand,
} from './entities/company.entity';
import { FeesUpdateDto } from './dto/fees-update-dto';

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

    const paymentDebitCardBrand: PaymentDebitCardBrand = JSON.parse(
      createCompanyDto.paymentDebitCardBrand,
    );

    const paymentVoucherBrand: PaymentVoucherBrand = JSON.parse(
      createCompanyDto.paymentVoucherBrand,
    );

    delete createCompanyDto.paymentMethodAvailable;
    delete createCompanyDto.paymentCardBrand;
    delete createCompanyDto.paymentDebitCardBrand;
    delete createCompanyDto.paymentVoucherBrand;

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
        logoUrl: imageUrlData.path,
        slugName: createCompanyDto.slugName,
        openingHours: {
          create: [
            {
              dayOfWeek: 0,
              startTime: null,
              endTime: null,
              closed: true,
            },

            {
              dayOfWeek: 1,
              startTime: null,
              endTime: null,
              closed: true,
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
        companyPayment: {
          create: {
            method: paymentMethodAvailable,
            cardBrand: paymentCardBrand,
            voucherBrand: paymentVoucherBrand,
            debitCardBrand: paymentDebitCardBrand,
          },
        },
        deliveryFee: {
          create: {
            isFree: true,
            type: 'FIXED',
          },
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
    let paymentDebitCardBrand: PaymentCardBrand;
    let paymentVoucherBrand: PaymentVoucherBrand;

    if (updateCompanyDto?.availability?.length) {
      availability = JSON.parse(updateCompanyDto?.availability);
    }

    if (updateCompanyDto?.paymentMethodAvailable?.length) {
      paymentMethodAvailable = JSON.parse(
        updateCompanyDto?.paymentMethodAvailable,
      );
    }

    if (updateCompanyDto?.paymentCardBrand?.length) {
      paymentCardBrand = JSON.parse(updateCompanyDto?.paymentCardBrand);
    }

    if (updateCompanyDto?.paymentDebitCardBrand?.length) {
      paymentDebitCardBrand = JSON.parse(
        updateCompanyDto?.paymentDebitCardBrand,
      );
    }

    if (updateCompanyDto?.paymentVoucherBrand?.length) {
      paymentVoucherBrand = JSON.parse(updateCompanyDto?.paymentVoucherBrand);
    }

    delete updateCompanyDto.paymentMethodAvailable;
    delete updateCompanyDto.paymentCardBrand;
    delete updateCompanyDto.paymentDebitCardBrand;
    delete updateCompanyDto.paymentVoucherBrand;

    const company = {
      ...updateCompanyDto,
      availability,
    };

    const companyPayment = {
      method: paymentMethodAvailable,
      cardBrand: paymentCardBrand,
      voucherBrand: paymentVoucherBrand,
      documentInTicket: !!updateCompanyDto.paymentDocumentInTicket,
      requiredDocument: !!updateCompanyDto.paymentRequiredDocument,
      debitCardBrand: paymentDebitCardBrand,
    };

    delete company.paymentRequiredDocument;
    delete company.paymentDocumentInTicket;

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
        companyPayment: companyPayment && {
          upsert: {
            create: {
              method: paymentMethodAvailable,
              cardBrand: paymentCardBrand,
              voucherBrand: paymentVoucherBrand,
            },
            update: {
              method: paymentMethodAvailable,
              cardBrand: paymentCardBrand,
              voucherBrand: paymentVoucherBrand,
              ...companyPayment,
            },
          },
        },
      },
      include: {
        companyPayment: true,
        openingHours: true,
      },
    });

    return {
      company: companyFormaterHelper(editedCompany),
    };
  }

  remove(id: number) {}

  async feesUpdate(companyId: number, fees: FeesUpdateDto) {
    try {
      return await this.prisma.company.update({
        where: { id: companyId },
        data: {
          deliveryFee: {
            update: {
              isFree: fees.isFree,
              type: fees.type,
              fixedFee: fees.fixedFee,
              estimatedTime: fees.estimatedTime,

              tiers: fees.tiers
                ? {
                    deleteMany: {},
                    create: fees.tiers.map((t) => ({
                      maxKm: t.maxKm,
                      price: t.price,
                      isFree: t.isFree ?? false,
                      estimatedTime: t.estimatedTime,
                    })),
                  }
                : undefined,
            },
          },
        },
        include: {
          deliveryFee: {
            include: { tiers: true },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar taxas');
    }
  }
}
