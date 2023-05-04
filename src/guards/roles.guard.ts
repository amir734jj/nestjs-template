import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import User from '../models/users.model';
import * as _ from 'lodash';
import { USER_ROLES } from '../constants/role.constant';
import { UserRole } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const actionRoles =
      this.reflector.get<UserRole[]>(USER_ROLES, context.getHandler()) || [];
    const classRoles =
      this.reflector.get<UserRole[]>(USER_ROLES, context.getClass()) || [];

    if (!actionRoles.length && !classRoles.length) {
      return true;
    }

    const allRoles = [...actionRoles, ...classRoles].map((x) => x.toString());

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    return _.chain(user.roles)
      .map((role) => role.name)
      .intersection(allRoles)
      .isEqual(allRoles)
      .value();
  }
}
