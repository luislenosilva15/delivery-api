type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export class CreateMenuGroupDto {
  name: string;
  menuId: number;
  alwaysAvailable: boolean;
  menuHours?:
    | {
        dayOfWeek: DayOfWeek;
        startTime: string | null;
        endTime: string | null;
        closed: boolean;
      }[]
    | null;
}
