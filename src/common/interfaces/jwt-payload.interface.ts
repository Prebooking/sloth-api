import { UserType } from "../../auth/dto/login.dto";

export interface JwtPayload {
  email: string;
  sub: number;
  userType: UserType;
}
