import { Controller, UseGuards, Param, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import AuthService from '../services/auth.service';
import JwtAuthGuard from '../logic/jwt-auth.guard';
import User from '../models/users.model';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/role.enum';
import { ADMIN_ROLE } from '../constants/role.constant';

@ApiTags('manage_account')
@Controller('manage/account')
@Roles(ADMIN_ROLE)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export default class ManageAccountController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role/:role')
  @ApiParam({ name: 'id', description: 'userId' })
  @ApiParam({ name: 'role', enum: UserRole })
  @ApiOkResponse({
    description: 'Successfully updated the roles',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  async setUserRole(
    @Param('id') userId: number,
    @Param('role') role: UserRole,
  ): Promise<User | null> {
    return await this.authService.setUserRole(userId, role);
  }
}
