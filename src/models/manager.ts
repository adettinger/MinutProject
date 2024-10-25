import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Property } from "./property";

@Entity()
export class Manager {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  AuthToken!: string;

  @OneToMany((_type) => Property, (property: Property) => property.manager)
  propertys!: Array<Property>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}