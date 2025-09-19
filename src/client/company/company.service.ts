import { Injectable } from '@nestjs/common';
import { companyFormaterHelper } from 'src/helpers/company-formater-helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        openingHours: true,
        companyPayment: true,
        menu: {
          select: {
            id: true,
          },
        },
      },
    });

    const menuId = company.menu[0]?.id || null;

    delete company.menu;

    const formatedCompany = companyFormaterHelper(company);

    formatedCompany.menuId = menuId;

    return {
      company: formatedCompany,
    };
  }
}
