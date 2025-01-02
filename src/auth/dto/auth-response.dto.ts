import { UserType } from "./login.dto";

export class AuthResponseDto {
    accessToken: string;
    userType: UserType;
    userId: number;
    email: string;
  }
  