import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';

@Injectable()
export class ClientOrJwtGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();

    const headers = req.headers as Record<string, string | undefined>;
    const headerClientId =
      headers['clientid'] || headers['client-id'] || headers['x-client-id'];

    if (headerClientId) {
      const clientData = await this.prisma.client.findFirst({
        where: { id: Number(headerClientId) },
      });

      return !!clientData;
    }
  }

  static extractClientId(context: ExecutionContext): number | null;
  static extractClientId(req: Request): number | null;
  static extractClientId(
    contextOrReq: ExecutionContext | Request,
  ): number | null {
    let req: Request;
    if ('switchToHttp' in contextOrReq) {
      req = contextOrReq.switchToHttp().getRequest<Request>();
    } else {
      req = contextOrReq;
    }

    const headers = req.headers as Record<string, string | undefined>;
    const headerClientId =
      headers['clientid'] || headers['client-id'] || headers['x-client-id'];

    if (headerClientId) {
      const clientId = Number(headerClientId);
      return Number.isNaN(clientId) ? null : clientId;
    }

    return null;
  }
}
