import { IsString, IsNumber, IsNotEmpty, IsOptional, IsArray, Min, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  salePrice: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  actualPrice: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  categoryId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  shopId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @Type(() => Number)
  staffIds: number[];

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  duration?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
