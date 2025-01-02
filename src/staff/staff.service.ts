import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { ShopOwner } from '../shops/entities/shop-owner.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(ShopOwner)
    private readonly shopOwnerRepository: Repository<ShopOwner>,
  ) { }

  async createStaff(shopOwnerId: number, createStaffDto: CreateStaffDto): Promise<Staff> {
    const existingStaff = await this.staffRepository.findOne({
      where: { email: createStaffDto.email },
    });

    if (existingStaff) {
      throw new ConflictException('Email already exists');
    }

    const shopOwner = await this.shopOwnerRepository.findOne({
      where: { id: shopOwnerId },
    });

    if (!shopOwner) {
      throw new NotFoundException('Shop owner not found');
    }

    const hashedPassword = await bcrypt.hash(createStaffDto.password, 10);
    const staff = this.staffRepository.create({
      ...createStaffDto,
      password: hashedPassword,
      shopOwner,
    });

    return await this.staffRepository.save(staff);
  }

  async resetPassword(id: number, newPassword: string): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['shopOwner'],
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    staff.password = hashedPassword;
    return await this.staffRepository.save(staff);
  }

  async updateWorkingDays(id: number, workingDays: string[]): Promise<Staff> {
    const staff = await this.findById(id);
    staff.workingDays = workingDays;
    return await this.staffRepository.save(staff);
  }

  async updateUnavailableDates(id: number, unavailableDates: Date[]): Promise<Staff> {
    const staff = await this.findById(id);
    staff.unavailableDates = unavailableDates;
    return await this.staffRepository.save(staff);
  }

  async findById(id: number): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['shopOwner'],
    });
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }
    return staff;
  }

  async findByShopOwner(shopOwnerId: number): Promise<Staff[]> {
    return await this.staffRepository.find({
      where: { shopOwner: { id: shopOwnerId } },
      relations: ['shopOwner'],
    });
  }
}
