import {Controller, UseGuards} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import User from '../models/users.model';
import { AbstractController } from '../abstracts/abstract.controller';
import UsersService from '../services/users.service';
import IBasicCrud from '../interfaces/crud.interface';
import JwtAuthGuard from '../logic/jwt-auth.guard';
import {RolesGuard} from "../guards/roles.guard";
import {Roles} from "../decorators/roles.decorator";
import {ADMIN_ROLE} from "../constants/role.constant";

@ApiTags('user')
@Controller('user')
@Roles(ADMIN_ROLE)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export default class UserController extends AbstractController<User> {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  service: IBasicCrud<User> = this.usersService;
}
