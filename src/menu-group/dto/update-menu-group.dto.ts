import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuGroupDto } from './create-menu-group.dto';

type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export class UpdateMenuGroupDto extends PartialType(CreateMenuGroupDto) {
  name: string;
  alwaysAvailable: boolean;
  disabled: boolean;
  menuHours?:
    | {
        dayOfWeek: DayOfWeek;
        startTime: string | null;
        endTime: string | null;
        closed: boolean;
      }[]
    | null;
}
