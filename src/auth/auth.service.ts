import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { userFormaterHelper } from 'src/helpers/user-formater-helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly jwtService: JwtService,
  ) {}
  async login(auth: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: auth.email },
    });

    if (!user || !(await bcrypt.compare(auth.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      id: user.id,
      email: user.email,
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
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
      },
    });

    const company = user.company;
    delete user.company;

    return {
      user: userFormaterHelper(user),
      company,
      acessToken: this.jwtService.sign({ id: user.id, email: user.email }),
    };
  }
}
