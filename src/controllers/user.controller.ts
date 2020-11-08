import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../models/users.model';
import { AbstractController } from '../abstracts/abstract.controller';
import UsersService from '../services/users.service';
import BasiCrud from '../interfaces/crud.interface';
import { JwtAuthGuard } from '../logic/jwt-auth.guard';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController extends AbstractController<User> {
  constructor(private usersService: UsersService) {
    super();
  }

  service: BasiCrud<User> = this.usersService;
}
