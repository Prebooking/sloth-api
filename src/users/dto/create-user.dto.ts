import { IsString, IsNotEmpty, IsEmail, IsIn, IsNumber, Min } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;
  
    @IsString()
    @IsNotEmpty()
    district: string;
  
    @IsString()
    @IsIn(['male', 'female', 'other'])
    gender: string;
  
    @IsNumber()
    @Min(0)
    age: number;
  }
  