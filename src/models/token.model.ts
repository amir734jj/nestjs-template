import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import User from './users.model';
import { Exclude } from 'class-transformer';
import IEntity from 'src/interfaces/entity.interface';

@Entity()
export default class Token implements IEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column({ length: 256 })
  value: string;

  @Column({})
  expiresIn: Date;

  @ManyToOne(() => User, (user) => user.tokens)
  user: User;
}
