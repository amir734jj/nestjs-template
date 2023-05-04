import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import AuthService from '../services/auth.service';
import JwtAuthGuard from '../guards/jwt-auth.guard';
import User from '../models/users.model';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/role.enum';

@ApiTags('manage_account')
@Controller('manage/account')
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export default class ManageAccountController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/role/:role')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/active/:active')
  @ApiParam({ name: 'id', description: 'userId' })
  @ApiParam({ name: 'active', required: true })
  @ApiOkResponse({
    description: 'Successfully updated the active',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  async setUserActive(
    @Param('id') userId: number,
    @Param('active') active: boolean,
  ): Promise<User | null> {
    return await this.authService.setUserActive(userId, active);
  }
}
