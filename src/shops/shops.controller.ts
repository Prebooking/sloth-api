import { Controller, Post, UseGuards, Body, Param } from "@nestjs/common";
import { CreateShopOwnerDto } from "./dto/create-shop-owner.dto";
import { ShopsService } from "./shops.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) { }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  async registerShopOwner(@Body() createShopOwnerDto: CreateShopOwnerDto) {
    return this.shopsService.createShopOwner(createShopOwnerDto);
  }

  @Post('approve/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  async approveShopOwner(@Param('id') id: string) {
    return this.shopsService.approveShopOwner(+id);
  }
}
