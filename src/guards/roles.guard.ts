import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import User from '../models/users.model';
import * as _ from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const actionRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];
    const classRoles =
      this.reflector.get<string[]>('roles', context.getClass()) || [];

    if (!actionRoles.length && !classRoles.length) {
      return true;
    }

    const allRoles = [...actionRoles, ...classRoles];

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    return _.chain(user.roles)
      .map((role) => role.name)
      .intersection(allRoles)
      .isEqual(allRoles)
      .value();
  }
}
