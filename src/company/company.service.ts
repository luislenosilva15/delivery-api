import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    files: {
      cover?: Express.Multer.File[];
      logo?: Express.Multer.File[];
    },
  ) {
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

    const cover =
      'https://st3.depositphotos.com/5918238/18694/i/450/depositphotos_186942178-stock-photo-grunge-scratched-blue-background-illustration.jpg';

    const logo =
      'https://marketplace.canva.com/EAF5s5UAeZ8/1/0/1600w/canva-logotipo-para-pizzaria-simples-vermelho-9fbcMglfwGo.jpg';

    const company = await this.prisma.company.create({
      data: {
        ...createCompanyDto,
        coverImageUrl: cover,
        logoUrl: logo,
      },
    });

    return company;
  }

  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {}

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
