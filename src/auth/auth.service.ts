import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { userFormaterHelper } from 'src/helpers/user-formater-helper';
import { companyFormaterHelper } from 'src/helpers/company-formater-helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly jwtService: JwtService,
  ) {}
  async login(auth: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: auth.email },
      include: {
        company: {
          include: {
            openingHours: true,
            companyPayment: true,
          },
        },
      },
    });

    if (!user || !(await bcrypt.compare(auth.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Usuário inativo, contate o administrador',
      );
    }

    const payload = {
      id: user.id,
      email: user.email,
      companyId: user.companyId,
    };

    const token = this.jwtService.sign(payload);

    return {
      acessToken: token,
      user: userFormaterHelper(user),
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: {
          include: {
            openingHours: true,
            companyPayment: true,
          },
        },
      },
    });

    const company = user.company;
    delete user.company;

    return {
      user: userFormaterHelper(user),
      company: companyFormaterHelper(company),
      acessToken: this.jwtService.sign({ id: user.id, email: user.email }),
    };
  }
}
