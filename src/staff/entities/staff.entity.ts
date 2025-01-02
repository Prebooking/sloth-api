import { ShopOwner } from "src/shops/entities/shop-owner.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Staff {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @ManyToOne(() => ShopOwner)
    shopOwner: ShopOwner;

    @Column('simple-array')
    workingDays: string[];

    @Column('simple-array')
    unavailableDates: Date[];
}
