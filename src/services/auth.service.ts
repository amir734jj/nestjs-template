import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../dtos/login.user.dto';
import { DataStoredInToken } from '../interfaces/auth.interface';
import { DateTime } from 'luxon';
import UserService from './users.service';
import { CreateUserDto } from '../dtos/create.user.dto';
import { LogoutUserDto } from '../dtos/logout.user.dto';
import { User } from '../models/users.model';
import TokenService from './token.service';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import { Token } from '../models/token.model';

@Injectable()
class AuthService {
  private readonly salt = 10;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async register(userData: CreateUserDto): Promise<User> {
    return await this.userService.save({
      ...userData,
      password: await bcrypt.hash(userData.password, this.salt),
    });
  }

  public async login(loginUserDto: LoginUserDto): Promise<string> {
    const user = await this.userService.find({
      username: loginUserDto.username,
    });
    if (user && (await bcrypt.compare(loginUserDto.password, user.password))) {
      await this.cleanUpUniqueTokens(user.tokens);
      const token = await this.createUniqueToken(user);
      const tk = await this.tokenService.save({
        value: token,
        expiresIn: DateTime.local()
          .plus({
            minute: this.configService.get<number>('JWT_EXPIRES'),
          })
          .toJSDate(),
        user,
      });

      const dataStoredInToken: DataStoredInToken = {
        id: user.id,
        username: user.username,
        token,
      };

      return await this.jwtService.signAsync(dataStoredInToken, {
        expiresIn: '1h',
        secret: "B796A1F7773FDFA9F051457B0AA10D0872A94EDA4925D73839EE5029124245BB"
      });
    }
    return null;
  }

  public async logout(logoutUserDto: LogoutUserDto): Promise<User> {
    const token = await this.tokenService.find({ value: logoutUserDto.token });
    const user = await this.userService.find({ id: token.user.id });
    await this.tokenService.delete(token.id);

    return user;
  }

  public async challenge({
    id,
    token,
    username,
  }: DataStoredInToken): Promise<User> {
    const user = await this.userService.find({ id, username });
    let tk: Token;
    if (user && (tk = user.tokens.find((x) => x.value === token))) {
      const minutesToExpire = DateTime.fromJSDate(tk.expiresIn)
        .diff(DateTime.local())
        .as('minutes');
      if (minutesToExpire <= 5) {
        Logger.log('Triggering token refresh');
        await this.refreshToken(tk);
      }
      return user;
    }

    Logger.log('Token not found');
    return null;
  }

  public async refreshToken(token: Token) {
    await this.tokenService.save({
      ...token,
      expiresIn: DateTime.local()
        .plus({
          minute: this.configService.get<number>('JWT_EXPIRES'),
        })
        .toJSDate(),
    });

    Logger.log('Token successfully refreshed');
  }

  private async createUniqueToken(user: User): Promise<string> {
    return await bcrypt.hash(
      _.toString({
        random: Math.random(), // hacky
        username: user.username,
        password: user.password,
      }),
      this.salt,
    );
  }

  private async cleanUpUniqueTokens(tokens: Token[]) {
    await Promise.all(
      tokens
        .filter(
          ({ expiresIn }) =>
            DateTime.fromJSDate(expiresIn)
              .diff(DateTime.local())
              .as('minutes') < 0,
        )
        .map((x) => this.tokenService.delete(x.id)),
    );
  }
}

export default AuthService;
