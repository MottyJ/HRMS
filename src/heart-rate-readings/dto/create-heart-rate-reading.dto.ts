import { IsString, IsNotEmpty, IsDate, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHeartRateReadingDto {
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsInt()
  @Min(0)
  @Max(300)
  @Type(() => Number)
  heartRate: number;

  @IsDate()
  @Type(() => Date)
  timestamp: Date;
}
