import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OptionalsService } from './optionals.service';
import { CreateOptionalDto } from './dto/create-optional.dto';
import { UpdateOptionalDto } from './dto/update-optional.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('optionals')
export class OptionalsController {
  constructor(private readonly optionalsService: OptionalsService) {}

  @Post()
  create(@Body() createOptionalDto: CreateOptionalDto) {
    return this.optionalsService.create(createOptionalDto);
  }

  @Get()
  findAll() {
    return this.optionalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.optionalsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOptionalDto: UpdateOptionalDto,
  ) {
    return this.optionalsService.update(+id, updateOptionalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.optionalsService.remove(+id);
  }
}
