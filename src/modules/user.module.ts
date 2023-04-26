import { Module } from '@nestjs/common';
import UserController from '../controllers/user.controller';
import UsersService from '../services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../models/users.model';
import Token from '../models/token.model';
import TokenService from '../services/token.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  controllers: [UserController],
  providers: [UsersService, TokenService],
  exports: [UsersService, TokenService],
})
export default class UserModule {}
