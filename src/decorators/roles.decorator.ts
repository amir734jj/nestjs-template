import { SetMetadata } from '@nestjs/common';
import { USER_ROLES } from '../constants/role.constant';

export const Roles = (...roles: string[]) => SetMetadata(USER_ROLES, roles);
