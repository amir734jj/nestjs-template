import { Repository } from 'typeorm';
import * as _ from 'lodash';
import User from '../models/users.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import IBasicCrud from '../interfaces/crud.interface';

@Injectable()
export default class UsersService implements IBasicCrud<User> {
  constructor(
    @InjectRepository(User) private readonly connection: Repository<User>,
  ) {}

  resolver(partial: Partial<User>): User {
    return _.extend(new User(), partial);
  }

  repository: Repository<User> = this.connection;

  includes = ['tokens'];

  public async all(): Promise<User[]> {
    return await this.repository.find({
      relations: this.includes,
      cache: true,
    });
  }

  public async delete(id: number): Promise<User | null> {
    const user = this.repository.findOneBy({ id });
    await this.repository.delete(id);
    return user;
  }

  public async find(props: Partial<User>): Promise<User | null> {
    return await this.repository.findOne({
      where: props,
      relations: this.includes,
      cache: true,
    });
  }

  async get(id: number): Promise<User | null> {
    return await this.repository.findOneBy({ id });
  }

  async save(instance: Partial<User>): Promise<User> {
    return await this.repository.save(instance);
  }

  public async update(
    id: number,
    partial: Partial<User>,
  ): Promise<User | null> {
    await this.repository.update(id, this.resolver(partial));
    return await this.repository.findOneBy({ id });
  }
}
