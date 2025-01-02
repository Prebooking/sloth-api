import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentType, AppointmentStatus } from './entities/appointment.entity';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ServiceEntity } from '../services/entities/service.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { CreateStaffAppointmentDto, CreateUserAppointmentDto } from './entities/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  async createUserAppointment(createDto: CreateUserAppointmentDto): Promise<Appointment> {
    const services = await this.serviceRepository.findByIds(createDto.serviceIds);
    if (services.length !== createDto.serviceIds.length) {
      throw new NotFoundException('Some services were not found');
    }

    const staff = await this.staffRepository.findOne({
      where: { id: createDto.selectedStaffId }
    });
    if (!staff) {
      throw new NotFoundException('Selected staff not found');
    }

    // Calculate total amount
    const totalAmount = services.reduce((sum, service) => sum + Number(service.salePrice), 0);

    const appointment = this.appointmentRepository.create({
      ...createDto,
      appointmentType: AppointmentType.USER,
      services,
      selectedStaff: staff,
      totalAmount,
      status: AppointmentStatus.PENDING
    });

    return await this.appointmentRepository.save(appointment);
  }

  async createStaffAppointment(createDto: CreateStaffAppointmentDto): Promise<Appointment> {
    const services = await this.serviceRepository.findByIds(createDto.serviceIds);
    if (services.length !== createDto.serviceIds.length) {
      throw new NotFoundException('Some services were not found');
    }

    const staff = await this.staffRepository.findOne({
      where: { id: createDto.selectedStaffId }
    });
    if (!staff) {
      throw new NotFoundException('Selected staff not found');
    }

    // Calculate total amount
    const totalAmount = services.reduce((sum, service) => sum + Number(service.salePrice), 0);

    const appointment = this.appointmentRepository.create({
      ...createDto,
      appointmentType: AppointmentType.STAFF,
      services,
      selectedStaff: staff,
      totalAmount,
      status: AppointmentStatus.CONFIRMED
    });

    return await this.appointmentRepository.save(appointment);
  }

  async updateAppointmentStatus(
    id: number,
    status: AppointmentStatus
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['services', 'selectedStaff', 'user']
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    appointment.status = status;
    return await this.appointmentRepository.save(appointment);
  }

  async getAppointmentById(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['services', 'selectedStaff', 'user', 'shop']
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async getShopAppointments(
    shopId: number,
    date?: Date,
    status?: AppointmentStatus
  ): Promise<Appointment[]> {
    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.services', 'services')
      .leftJoinAndSelect('appointment.selectedStaff', 'selectedStaff')
      .leftJoinAndSelect('appointment.user', 'user')
      .where('appointment.shopId = :shopId', { shopId });

    if (date) {
      query.andWhere('appointment.appointmentDate = :date', { date });
    }

    if (status) {
      query.andWhere('appointment.status = :status', { status });
    }

    return await query.getMany();
  }
}

