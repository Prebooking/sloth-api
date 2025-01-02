import { Controller, Post, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { UserType } from '../auth/dto/login.dto';
import { CreateStaffAppointmentDto, CreateUserAppointmentDto } from './entities/create-appointment.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AppointmentStatus } from './entities/appointment.entity';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('user')
  @Roles(UserType.USER)
  async createUserAppointment(@Body() createDto: CreateUserAppointmentDto) {
    return await this.appointmentsService.createUserAppointment(createDto);
  }

  @Post('staff')
  @Roles(UserType.STAFF, UserType.SHOPOWNER)
  async createStaffAppointment(@Body() createDto: CreateStaffAppointmentDto) {
    return await this.appointmentsService.createStaffAppointment(createDto);
  }

  @Put(':id/status')
  @Roles(UserType.STAFF, UserType.SHOPOWNER)
  async updateAppointmentStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus
  ) {
    return await this.appointmentsService.updateAppointmentStatus(
      parseInt(id),
      status
    );
  }

  @Get('shop/:shopId')
  @Roles(UserType.STAFF, UserType.SHOPOWNER)
  async getShopAppointments(
    @Param('shopId') shopId: string,
    @Query('date') date?: Date,
    @Query('status') status?: AppointmentStatus
  ) {
    return await this.appointmentsService.getShopAppointments(
      parseInt(shopId),
      date,
      status
    );
  }

  @Get(':id')
  @Roles(UserType.USER, UserType.STAFF, UserType.SHOPOWNER)
  async getAppointment(@Param('id') id: string) {
    return await this.appointmentsService.getAppointmentById(parseInt(id));
  }
}

