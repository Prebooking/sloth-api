import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { UserType } from '../auth/dto/login.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  @Post('categories')
  @Roles(UserType.SUPERADMIN)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.servicesService.createCategory(createCategoryDto);
  }

  @Put('categories/:id')
  @Roles(UserType.SUPERADMIN)
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return await this.servicesService.updateCategory(parseInt(id), updateCategoryDto);
  }

  @Get('categories')
  async getAllCategories() {
    return await this.servicesService.getAllCategories();
  }
}