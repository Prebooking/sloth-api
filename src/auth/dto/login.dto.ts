export class CreateAuthDto {}
import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum UserType {
  SUPERADMIN = 'superadmin',
  SHOPOWNER = 'shopowner',
  STAFF = 'staff',
  USER = 'user',
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  userType: UserType;
}

