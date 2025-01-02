import { IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { BaseAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(
  OmitType(BaseAppointmentDto, [] as const)
) {
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}
