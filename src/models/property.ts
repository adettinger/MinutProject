import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Reservation } from "./reservation";
import { Manager } from "./manager";

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: false })
  managerId!: number;
  @ManyToOne((_type) => Manager, (manager: Manager) => manager.propertys)
  @JoinColumn()
  manager!: Manager;

  @OneToMany((_type) => Reservation, (reservation: Reservation) => reservation.property)
  reservations!: Array<Reservation>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}