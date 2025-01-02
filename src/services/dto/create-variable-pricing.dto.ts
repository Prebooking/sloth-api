import { IsDate, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariablePricingDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  specialPrice: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  serviceId: number;
}
