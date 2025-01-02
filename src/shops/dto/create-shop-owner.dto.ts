import { IsString, IsNotEmpty, IsNumber, IsEmail, MinLength } from "class-validator";

export class CreateShopOwnerDto {
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
  
    @IsNumber()
    @IsNotEmpty()
    latitude: number;
  
    @IsNumber()
    @IsNotEmpty()
    longitude: number;
  
    @IsString()
    @IsNotEmpty()
    contactNumber: string;
  
    @IsString()
    @IsNotEmpty()
    whatsappNumber: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(6)
    password: string;
  }
  