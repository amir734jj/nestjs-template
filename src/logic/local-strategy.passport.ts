import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import AuthService from '../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { DataStoredInToken } from '../interfaces/auth.interface';
import User from '../models/users.model';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // noinspection JSUnusedGlobalSymbols
  async validate(payload: DataStoredInToken): Promise<User> {
    const user = await this.authService.challenge(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
