import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateOpeningHourDto {
  //   @IsInt()
  //   @Min(0)
  //   @Max(6)
  dayOfWeek: number;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  @IsOptional()
  startTime: string | null;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm format',
  })
  @IsOptional()
  endTime: string | null;

  @IsOptional()
  closed: boolean;
}
