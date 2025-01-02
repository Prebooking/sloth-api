import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto, UserType } from './dto/login.dto';
import { RegisterShopOwnerRequestDto } from './dto/register-request.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { ShopOwner } from 'src/shops/entities/shop-owner.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { User } from './entities/auth.entity';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ShopOwner)
    private readonly shopOwnerRepository: Repository<ShopOwner>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) { }

  async validateUser(email: string, password: string, userType: UserType): Promise<any> {
    let user;

    switch (userType) {
      case UserType.SUPERADMIN:
        user = await this.userRepository.findOne({
          where: { email, role: UserType.SUPERADMIN }
        });
        break;
      case UserType.SHOPOWNER:
        user = await this.shopOwnerRepository.findOne({
          where: { email, isApproved: true }
        });
        break;
      case UserType.STAFF:
        user = await this.staffRepository.findOne({
          where: { email },
          relations: ['shopOwner']
        });
        break;
      default:
        throw new UnauthorizedException('Invalid user type');
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password, userType } = loginDto;
    const user = await this.validateUser(email, password, userType);

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      userType: userType
    };

    return {
      accessToken: this.jwtService.sign(payload),
      userType: userType,
      userId: user.id,
      email: user.email
    };
  }

  async requestShopOwnerRegistration(registerDto: RegisterShopOwnerRequestDto) {
    const existingShopOwner = await this.shopOwnerRepository.findOne({
      where: { email: registerDto.email }
    });

    if (existingShopOwner) {
      throw new BadRequestException('Email already registered');
    }

    // Create pending shop owner registration
    const shopOwner = this.shopOwnerRepository.create({
      ...registerDto,
      isApproved: false
    });

    return await this.shopOwnerRepository.save(shopOwner);
  }

  async changePassword(userId: number, userType: UserType, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    let user;
    switch (userType) {
      case UserType.SUPERADMIN:
        user = await this.userRepository.findOne({ where: { id: userId } });
        break;
      case UserType.SHOPOWNER:
        user = await this.shopOwnerRepository.findOne({ where: { id: userId } });
        break;
      case UserType.STAFF:
        user = await this.staffRepository.findOne({ where: { id: userId } });
        break;
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }
}
