import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopOwner } from './entities/shop-owner.entity';
import { CreateShopOwnerDto } from './dto/create-shop-owner.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(ShopOwner)
    private readonly shopOwnerRepository: Repository<ShopOwner>,
  ) {}

  async createShopOwner(createShopOwnerDto: CreateShopOwnerDto): Promise<ShopOwner> {
    const existingShop = await this.shopOwnerRepository.findOne({
      where: { email: createShopOwnerDto.email },
    });

    if (existingShop) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createShopOwnerDto.password, 10);
    const shopOwner = this.shopOwnerRepository.create({
      ...createShopOwnerDto,
      password: hashedPassword,
    });

    return await this.shopOwnerRepository.save(shopOwner);
  }

  async approveShopOwner(id: number): Promise<ShopOwner> {
    const shopOwner = await this.shopOwnerRepository.findOne({ where: { id } });
    if (!shopOwner) {
      throw new NotFoundException('Shop owner not found');
    }

    shopOwner.isApproved = true;
    return await this.shopOwnerRepository.save(shopOwner);
  }

  async findById(id: number): Promise<ShopOwner> {
    const shopOwner = await this.shopOwnerRepository.findOne({ where: { id } });
    if (!shopOwner) {
      throw new NotFoundException('Shop owner not found');
    }
    return shopOwner;
  }

  async findByEmail(email: string): Promise<ShopOwner> {
    const shopOwner = await this.shopOwnerRepository.findOne({ where: { email } });
    if (!shopOwner) {
      throw new NotFoundException('Shop owner not found');
    }
    return shopOwner;
  }

  async update(id: number, updateShopOwnerDto: Partial<CreateShopOwnerDto>): Promise<ShopOwner> {
    const shopOwner = await this.findById(id);
    Object.assign(shopOwner, updateShopOwnerDto);
    return await this.shopOwnerRepository.save(shopOwner);
  }
}
