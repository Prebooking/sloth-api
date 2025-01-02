import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ServiceEntity } from './entities/service.entity';
import { ServiceCategory } from './entities/service-category.entity';
import { VariablePricing } from './entities/variable-pricing.entity';
import { Staff } from '../staff/entities/staff.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateVariablePricingDto } from './dto/create-variable-pricing.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(ServiceCategory)
    private readonly categoryRepository: Repository<ServiceCategory>,
    @InjectRepository(VariablePricing)
    private readonly variablePricingRepository: Repository<VariablePricing>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<ServiceCategory> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name }
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<ServiceCategory> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name }
      });
      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async createService(createServiceDto: CreateServiceDto): Promise<ServiceEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id: createServiceDto.categoryId }
    });
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const staffMembers = await this.staffRepository.findByIds(createServiceDto.staffIds);
    if (staffMembers.length !== createServiceDto.staffIds.length) {
      throw new NotFoundException('Some staff members were not found');
    }

    const service = this.serviceRepository.create({
      ...createServiceDto,
      category,
      staffMembers,
    });

    return await this.serviceRepository.save(service);
  }

  async updateService(id: number, updateServiceDto: UpdateServiceDto): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['category', 'staffMembers']
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (updateServiceDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateServiceDto.categoryId }
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      service.category = category;
    }

    if (updateServiceDto.staffIds) {
      const staffMembers = await this.staffRepository.findByIds(updateServiceDto.staffIds);
      if (staffMembers.length !== updateServiceDto.staffIds.length) {
        throw new NotFoundException('Some staff members were not found');
      }
      service.staffMembers = staffMembers;
    }

    Object.assign(service, updateServiceDto);
    return await this.serviceRepository.save(service);
  }

  async addVariablePricing(createVariablePricingDto: CreateVariablePricingDto): Promise<VariablePricing> {
    const service = await this.serviceRepository.findOne({
      where: { id: createVariablePricingDto.serviceId }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (createVariablePricingDto.startDate >= createVariablePricingDto.endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Check for overlapping date ranges
    const existingPricing = await this.variablePricingRepository.findOne({
      where: {
        serviceId: createVariablePricingDto.serviceId,
        isActive: true,
        startDate: LessThanOrEqual(createVariablePricingDto.endDate),
        endDate: MoreThanOrEqual(createVariablePricingDto.startDate),
      },
    });

    if (existingPricing) {
      throw new ConflictException('Overlapping variable pricing exists for this date range');
    }

    const variablePricing = this.variablePricingRepository.create({
      ...createVariablePricingDto,
      service
    });

    return await this.variablePricingRepository.save(variablePricing);
  }

  async getServicePrice(serviceId: number, date: Date): Promise<number> {
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const variablePricing = await this.variablePricingRepository.findOne({
      where: {
        serviceId,
        isActive: true,
        startDate: LessThanOrEqual(date),
        endDate: MoreThanOrEqual(date),
      },
    });

    return variablePricing ? variablePricing.specialPrice : service.salePrice;
  }

  async deleteService(id: number): Promise<void> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    service.isActive = false;
    await this.serviceRepository.save(service);
  }

  async getServicesByShop(shopId: number): Promise<ServiceEntity[]> {
    return await this.serviceRepository.find({
      where: { 
        shopId,
        isActive: true 
      },
      relations: ['category', 'staffMembers'],
    });
  }

  async getAllCategories(): Promise<ServiceCategory[]> {
    return await this.categoryRepository.find();
  }
}
