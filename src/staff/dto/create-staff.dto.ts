import { IsString, IsNotEmpty, IsEmail, MinLength, IsArray, IsDateString } from "class-validator";

export class CreateStaffDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsArray()
    @IsString({ each: true })
    workingDays: string[];

    @IsArray()
    @IsDateString({}, { each: true })
    unavailableDates: string[];
}
