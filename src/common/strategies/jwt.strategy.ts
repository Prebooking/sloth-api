import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ShopOwner } from '../../shops/entities/shop-owner.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserType } from '../../auth/dto/login.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ShopOwner)
    private readonly shopOwnerRepository: Repository<ShopOwner>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key', // Use environment variable in production
    });
  }

  async validate(payload: JwtPayload) {
    let user;

    switch (payload.userType) {
      case UserType.SUPERADMIN:
        user = await this.userRepository.findOne({
          where: { id: payload.sub, role: UserType.SUPERADMIN },
        });
        break;

      case UserType.SHOPOWNER:
        user = await this.shopOwnerRepository.findOne({
          where: { id: payload.sub, isApproved: true },
        });
        break;

      case UserType.STAFF:
        user = await this.staffRepository.findOne({
          where: { id: payload.sub },
          relations: ['shopOwner'],
        });
        break;

      default:
        throw new UnauthorizedException('Invalid user type');
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: payload.sub,
      email: payload.email,
      userType: payload.userType,
      ...(user.shopOwner && { shopOwnerId: user.shopOwner.id }), // Include shop owner ID for staff
    };
  }
}
