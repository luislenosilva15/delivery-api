import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OpeningHoursService } from './opening-hours.service';
import { CreateOpeningHourDto } from './dto/create-opening-hour.dto';

import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { UpdateOpeningHourDto } from './dto/update-opening-hour.dto';

@UseGuards(JwtAuthGuard)
@Controller('opening-hours')
export class OpeningHoursController {
  constructor(private readonly openingHoursService: OpeningHoursService) {}

  @Post()
  create(
    @Body() createOpeningHourDto: CreateOpeningHourDto[],
    @Req() req: JwtPayload,
  ) {
    return this.openingHoursService.create(
      req.user.companyId,
      createOpeningHourDto,
    );
  }

  @Patch()
  update(
    @Body() updateOpeningHourDto: UpdateOpeningHourDto[],
    @Req() req: JwtPayload,
  ) {
    return this.openingHoursService.update(
      req.user.companyId,
      updateOpeningHourDto,
    );
  }

  @Post('always-open')
  alwaysOpen(@Req() req: JwtPayload) {
    return this.openingHoursService.alwaysOpen(req.user.companyId);
  }

  // send current temporaryClosed status
  @Post('temporary-closed')
  temporaryClosed(@Body() body: { closed: boolean }, @Req() req: JwtPayload) {
    return this.openingHoursService.temporaryClosed(
      req.user.companyId,
      body.closed,
    );
  }

  @Get()
  findAll(@Req() req: JwtPayload) {
    return this.openingHoursService.findAll(req.user.companyId);
  }

  @Delete('')
  remove(@Req() req: JwtPayload) {
    return this.openingHoursService.remove(req.user.companyId);
  }
}
