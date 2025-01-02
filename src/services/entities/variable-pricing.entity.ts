import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ServiceEntity } from './service.entity';

@Entity('variable_pricing')
export class VariablePricing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ServiceEntity, { onDelete: 'CASCADE' })
  service: ServiceEntity;

  @Column()
  serviceId: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  specialPrice: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

