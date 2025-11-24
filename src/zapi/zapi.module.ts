import { Module } from '@nestjs/common';
import { ZApiService } from './zapi.service';
import { ZApiController } from './zapi.controller';

@Module({
  controllers: [ZApiController],
  providers: [ZApiService],
  exports: [ZApiService],
})
export class ZApiModule {}
