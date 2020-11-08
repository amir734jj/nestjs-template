import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../dtos/login.user.dto';
import { CreateUserDto } from '../dtos/create.user.dto';
import AuthService from '../services/auth.service';
import { JwtAuthGuard } from '../logic/jwt-auth.guard';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
  })
  async login(@Body() login: LoginUserDto): Promise<any> {
    return await this.authService.login(login);
  }

  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Successfully registered',
  })
  async register(@Body() register: CreateUserDto): Promise<any> {
    return await this.authService.register(register);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
  })
  async logout(@Request() req): Promise<any> {
    return await this.authService.logout(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
