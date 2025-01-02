import { IsEnum, IsArray, IsNumber, IsDate, IsString, IsOptional, IsEmail, IsPhoneNumber, ArrayMinSize, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentType } from '../entities/appointment.entity';

export class BaseAppointmentDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  serviceIds: number[];

  @IsNumber()
  selectedStaffId: number;

  @IsDate()
  @Type(() => Date)
  appointmentDate: Date;

  @IsString()
  appointmentTime: string;

  @IsNumber()
  shopId: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateUserAppointmentDto extends BaseAppointmentDto {
  @IsNumber()
  userId: number;
}

export class CreateStaffAppointmentDto extends BaseAppointmentDto {
  @IsString()
  customerName: string;

  @IsPhoneNumber()
  customerPhone: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsNumber()
  createdByStaffId: number;
}
