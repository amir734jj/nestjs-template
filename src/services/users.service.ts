import { Repository } from 'typeorm';
import { AbstractDal } from '../abstracts/abstract.dal';
import * as _ from 'lodash';
import { User } from '../models/users.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
class UsersService extends AbstractDal<User> {
  constructor(@InjectRepository(User) private connection: Repository<User>) {
    super();
  }

  resolver(partial: Partial<User>): User {
    return _.extend(new User(), partial);
  }

  repository: Repository<User> = this.connection;

  includes = ['tokens'];
}

export default UsersService;
