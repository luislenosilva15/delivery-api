import { Controller, Get, Param } from '@nestjs/common';
import { MenuGroupService } from './menu-group.service';

@Controller('client/menu-group')
export class MenuGroupController {
  constructor(private readonly menuGroupService: MenuGroupService) {}

  @Get('menu/:id')
  findAll(@Param('id') id: string) {
    return this.menuGroupService.findAll(+id);
    return 'ss';
  }
}
