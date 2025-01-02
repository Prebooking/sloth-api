import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShopOwner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerName: string;

  @Column()
  shopName: string;

  @Column()
  shopLocation: string;

  @Column()
  district: string;

  @Column()
  state: string;

  @Column('decimal')
  latitude: number;

  @Column('decimal')
  longitude: number;

  @Column()
  contactNumber: string;

  @Column()
  whatsappNumber: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isApproved: boolean;
}
