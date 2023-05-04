import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import Token from './token.model';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import IEntity from 'src/interfaces/entity.interface';
import Role from './roles.model';

@Entity()
@Unique(['username'])
export default class User implements IEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  active: boolean;

  @ApiProperty()
  @Column({ length: 256, default: '' })
  name: string;

  @ApiProperty()
  @Column({ length: 256 })
  username: string;

  @Exclude()
  @Column({ length: 256 })
  password: string;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @JoinTable({ name: 'user-role-relationship' })
  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];
}
