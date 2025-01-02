import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { State } from "./state.entity";

@Entity()
export class District {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => State)
  state: State;
}
