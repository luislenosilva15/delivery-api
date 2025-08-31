import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt.guard';
import { JwtPayload } from './types/jwt-payload.type';
import { StorageService } from 'src/storage/storage.service';
import { Readable } from 'stream';
import { basename, extname } from 'path';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: JwtPayload) {
    return await this.authService.getProfile(Number(req.user.id));
  }

  private bufferToMulterFile(
    buffer: Buffer,
    filename: string,
    mimetype: string,
  ): Express.Multer.File {
    return {
      fieldname: 'file',
      originalname: filename,
      encoding: '7bit',
      mimetype,
      size: buffer.length,
      stream: Readable.from(buffer),
      destination: '',
      filename,
      path: '',
      buffer,
    };
  }

  @Post('download')
  async downloadFile(@Body('url') url: string) {
    const res = await fetch(url);

    if (!res.ok) {
      return { error: `Falha no download: ${res.status} ${res.statusText}` };
    }

    const contentType =
      res.headers.get('content-type') || 'application/octet-stream';

    // tenta pegar nome + extensão direto da URL
    let fileName = basename(new URL(url).pathname);
    let fileExt = extname(fileName);

    if (!fileExt) {
      // se a URL não tiver extensão, tenta usar o contentType
      const fallbackExt = contentType.split('/')[1] || 'bin';
      fileExt = `.${fallbackExt}`;
      fileName = `file${fileExt}`;
    }

    const arrayBuffer = await res.arrayBuffer();
    const blobBuffer = Buffer.from(arrayBuffer);

    const fakeFile = this.bufferToMulterFile(blobBuffer, fileName, contentType);

    await this.storageService.upload('company', fakeFile, fileName);

    return {
      fileName,
      fileExt,
      size: blobBuffer.length,
      contentType,
      isBinary: true,
    };
  }
}
