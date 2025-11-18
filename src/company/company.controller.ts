import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
  Req,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { FeesUpdateDto } from './dto/fees-update-dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.companyService.create(createCompanyDto, image);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.companyService.update(+id, updateCompanyDto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/fees')
  feesUpdate(@Body() feesUpdateDto: FeesUpdateDto, @Req() req: JwtPayload) {
    console.error('feesUpdateDto', feesUpdateDto);
    return this.companyService.feesUpdate(+req.user.companyId, feesUpdateDto);
  }
}
