import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractDal } from '../abstracts/abstract.dal';
import Role from "../models/roles.model";

@Injectable()
export default class RoleService extends AbstractDal<Role> {
  repository: Repository<Role> = this.connection;

  constructor(
    @InjectRepository(Role) private readonly connection: Repository<Role>,
  ) {
    super();
  }

  resolver(partial: Partial<Role>): Role {
    return _.extend(new Role(), partial);
  }

  override includes = ['users'];
}
