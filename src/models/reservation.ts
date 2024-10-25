import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Property } from "./property";
import { Manager } from "./manager";

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  propertyId!: number;
  @ManyToOne((_type) => Property, (property: Property) => property.reservations)
  @JoinColumn()
  property!: Property;

  @Column()
  guestEmail!: string;

  @Column()
  guestPhone!: number;

  @Column()
  start!: Date;

  @Column()
  end!: Date;

  @Column({ nullable: true })
  checkIn!: Date;

  @Column({ nullable: true })
  checkOut!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}