import { Repository } from 'typeorm';
import * as _ from 'lodash';
import User from '../models/users.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractDal } from '../abstracts/abstract.dal';

@Injectable()
export default class UsersService extends AbstractDal<User> {
  constructor(
    @InjectRepository(User) private readonly connection: Repository<User>,
  ) {
    super();
  }

  resolver(partial: Partial<User>): User {
    return _.extend(new User(), partial);
  }

  repository: Repository<User> = this.connection;

  override includes = ['tokens', 'roles'];
}
