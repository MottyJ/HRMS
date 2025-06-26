import { IsString, IsNotEmpty, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(150)
  age: number;

  @IsString()
  @IsIn(['male', 'female', 'other'])
  gender: string;
}
