import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
