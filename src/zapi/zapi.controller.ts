import { Controller, Post, Body } from '@nestjs/common';
import { ZApiService } from './zapi.service';

@Controller('zapi')
export class ZApiController {
  constructor(private readonly zapi: ZApiService) {}

  @Post('send')
  async send(@Body() body: { phone: string; message: string }) {
    return this.zapi.sendText(body.phone, body.message);
  }
}
