import { Controller, Post, UseGuards, Body, Put, Param, BadRequestException } from "@nestjs/common";
import { CreateStaffDto } from "./dto/create-staff.dto";
import { StaffService } from "./staff.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { UserType } from "src/auth/dto/login.dto";

@Controller('create-staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) { }

  @Post(':shopId/create')
  @Roles(UserType.SHOPOWNER)
  async createStaff(
    @Param('shopId') shopId: string,
    @Body() createStaffDto: CreateStaffDto
  ) {
    if (!shopId) {
      throw new BadRequestException('Shop ID is required');
    }
    return this.staffService.createStaff(parseInt(shopId), createStaffDto);
  }

  

  @Put('reset-password/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('shopowner')
  async resetStaffPassword(
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.staffService.resetPassword(+id, newPassword);
  }
}
