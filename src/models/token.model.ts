import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './users.model';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  value: string;

  @Column({})
  expiresIn: Date;

  @ManyToOne((type) => User, (user) => user.tokens)
  user: User;
}
