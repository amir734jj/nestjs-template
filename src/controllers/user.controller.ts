import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import User from '../models/users.model';
import { AbstractController } from '../abstracts/abstract.controller';
import UsersService from '../services/users.service';
import IBasicCrud from '../interfaces/crud.interface';
import JwtAuthGuard from '../logic/jwt-auth.guard';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export default class UserController extends AbstractController<User> {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  service: IBasicCrud<User> = this.usersService;
}
