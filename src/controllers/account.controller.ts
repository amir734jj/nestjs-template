import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import LoginUserDto from '../dtos/login.user.dto';
import CreateUserDto from '../dtos/create.user.dto';
import AuthService from '../services/auth.service';
import JwtAuthGuard from '../logic/jwt-auth.guard';

@ApiTags('account')
@Controller('account')
@ApiBearerAuth()
export default class AccountController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
  })
  async login(@Body() login: LoginUserDto): Promise<any> {
    const response = await this.authService.login(login);

    if (!response) {
      throw new BadRequestException('Login failed');
    } else {
      return response;
    }
  }

  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Successfully registered',
  })
  async register(@Body() register: CreateUserDto): Promise<any> {
    const response = await this.authService.register(register);

    if (!response) {
      throw new BadRequestException('Register failed');
    } else {
      return response;
    }
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
  @Post('refresh')
  async refreshToken(@Request() req) {
    await this.authService.refreshToken(req.token);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
