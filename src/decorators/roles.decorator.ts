import { SetMetadata } from '@nestjs/common';
import { USER_ROLES } from '../constants/role.constant';
import { UserRole } from '../enums/role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata(USER_ROLES, roles);
