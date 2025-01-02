import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import { ServiceEntity } from '../services/entities/service.entity';
import { Staff } from '../staff/entities/staff.entity';
import { User } from '../users/entities/user.entity';
import { ServicesModule } from '../services/services.module';
import { StaffModule } from '../staff/staff.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      ServiceEntity,
      Staff,
      User
    ]),
    ServicesModule,
    StaffModule,
    UsersModule
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule { }
