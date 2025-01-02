import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopOwner } from 'src/shops/entities/shop-owner.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { User } from './entities/auth.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key', // Use environment variable in production
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User, ShopOwner, Staff]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }

