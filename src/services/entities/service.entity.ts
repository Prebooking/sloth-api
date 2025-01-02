import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ServiceCategory } from './service-category.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { ShopOwner } from '../../shops/entities/shop-owner.entity';

@Entity('services')
export class ServiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  actualPrice: number;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => ServiceCategory, category => category.services)
  category: ServiceCategory;

  @Column()
  categoryId: number;

  @ManyToOne(() => ShopOwner)
  shopOwner: ShopOwner;

  @Column()
  shopId: number;

  @ManyToMany(() => Staff)
  @JoinTable({
    name: 'service_staff',
    joinColumn: { name: 'serviceId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'staffId', referencedColumnName: 'id' }
  })
  staffMembers: Staff[];

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
