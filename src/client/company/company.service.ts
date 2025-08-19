import { Injectable } from '@nestjs/common';
import { companyFormaterHelper } from 'src/helpers/company-formater-helper';
import isOpenNow from 'src/helpers/company-is-open-now.helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        openingHours: true,
        menu: {
          select: {
            id: true,
          },
        },
      },
    });

    const isOpen = isOpenNow(company);
    const menuId = company.menu[0]?.id || null;

    delete company.menu;

    const formatedCompany = companyFormaterHelper({
      ...company,
      isOpen,
    });

    formatedCompany.menuId = menuId;

    return {
      company: formatedCompany,
    };
  }
}
