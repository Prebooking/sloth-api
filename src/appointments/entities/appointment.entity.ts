import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { ServiceEntity } from '../../services/entities/service.entity';
import { ShopOwner } from '../../shops/entities/shop-owner.entity';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW'
}

export enum AppointmentType {
  USER = 'USER',
  STAFF = 'STAFF'
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: AppointmentType,
    default: AppointmentType.USER
  })
  appointmentType: AppointmentType;

  @ManyToMany(() => ServiceEntity)
  @JoinTable({
    name: 'appointment_services',
    joinColumn: { name: 'appointmentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'serviceId', referencedColumnName: 'id' }
  })
  services: ServiceEntity[];

  @ManyToOne(() => Staff)
  selectedStaff: Staff;

  @Column()
  selectedStaffId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'date' })
  appointmentDate: Date;

  @Column({ type: 'time' })
  appointmentTime: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING
  })
  status: AppointmentStatus;

  // For user appointments
  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Column({ nullable: true })
  userId: number;

  // For staff-created appointments
  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  customerPhone: string;

  @Column({ nullable: true })
  customerEmail: string;

  @ManyToOne(() => Staff, { nullable: true })
  createdByStaff: Staff;

  @Column({ nullable: true })
  createdByStaffId: number;

  @ManyToOne(() => ShopOwner)
  shop: ShopOwner;

  @Column()
  shopId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true, type: 'text' })
  notes: string;
}
