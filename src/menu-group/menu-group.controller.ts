import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MenuGroupService } from './menu-group.service';
import { CreateMenuGroupDto } from './dto/create-menu-group.dto';
import { UpdateMenuGroupDto } from './dto/update-menu-group.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

@UseGuards(JwtAuthGuard)
@Controller('menu-group')
export class MenuGroupController {
  constructor(private readonly menuGroupService: MenuGroupService) {}

  @Post()
  create(@Body() createMenuGroupDto: CreateMenuGroupDto) {
    return this.menuGroupService.create(createMenuGroupDto);
  }

  @Get()
  findAll(@Req() req: JwtPayload) {
    return this.menuGroupService.findAll(+req.user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuGroupService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMenuGroupDto: UpdateMenuGroupDto,
  ) {
    return this.menuGroupService.update(+id, updateMenuGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuGroupService.remove(+id);
  }
}
