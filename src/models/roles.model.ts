import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import IEntity from 'src/interfaces/entity.interface';
import User from './users.model';

@Entity()
@Unique(['name'])
export default class Role implements IEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ length: 256, default: '' })
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
