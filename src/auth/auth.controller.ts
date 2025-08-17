import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt.guard';
import { JwtPayload } from './types/jwt-payload.type';
import { StorageService } from 'src/storage/storage.service';
import { Readable } from 'stream';

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

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      const text = await res.text();
      return {
        error: 'Não foi retornada uma imagem',
        contentType,
        bodyPreview: text.slice(0, 200),
      };
    }

    const arrayBuffer = await res.arrayBuffer();
    const blobBuffer = Buffer.from(arrayBuffer);

    // cria arquivo no formato esperado pelo storageService
    const fakeFile = this.bufferToMulterFile(
      blobBuffer,
      'image.png',
      contentType,
    );

    await this.storageService.upload('company', fakeFile, 'image.png');

    return {
      size: blobBuffer.length,
      contentType,
      isBinary: true,
    };
  }
}
