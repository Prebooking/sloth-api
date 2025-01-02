import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import Controllers
import { ServicesController } from './services.controller';

// Import Services
import { ServicesService } from './services.service';

// Import Entities
import { ServiceEntity } from './entities/service.entity';
import { ServiceCategory } from './entities/service-category.entity';
import { VariablePricing } from './entities/variable-pricing.entity';
import { Staff } from '../staff/entities/staff.entity';
import { ShopOwner } from '../shops/entities/shop-owner.entity';

// Import Additional Required Modules
import { AuthModule } from '../auth/auth.module';
import { ShopsModule } from '../shops/shops.module';
import { StaffModule } from '../staff/staff.module';

@Module({
  imports: [
    // Register all entities with TypeORM
    TypeOrmModule.forFeature([
      ServiceEntity,
      ServiceCategory,
      VariablePricing,
      Staff,
      ShopOwner
    ]),

    // Import required modules
    AuthModule,
    ShopsModule,
    StaffModule
  ],
  controllers: [
    ServicesController
  ],
  providers: [
    ServicesService
  ],
  exports: [
    ServicesService,
    TypeOrmModule // Export TypeORM features if needed by other modules
  ]
})
export class ServicesModule { }