import { IsEmail, IsString, IsNotEmpty, IsPhoneNumber, IsNumber, IsLatitude, IsLongitude } from 'class-validator';

export class RegisterShopOwnerRequestDto {
  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @IsString()
  @IsNotEmpty()
  shopName: string;

  @IsString()
  @IsNotEmpty()
  shopLocation: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsPhoneNumber()
  contactNumber: string;

  @IsPhoneNumber()
  whatsappNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}