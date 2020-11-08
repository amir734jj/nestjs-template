import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../dtos/login.user.dto';
import { DataStoredInToken } from '../interfaces/auth.interface';
import { DateTime } from 'luxon';
import UserService from './users.service';
import { CreateUserDto } from '../dtos/create.user.dto';
import { LogoutUserDto } from '../dtos/logout.user.dto';
import { User } from '../models/users.model';
import TokenService from './token.service';
import { Injectable } from '@nestjs/common';
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
      await this.tokenService.save({
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

      return this.jwtService.sign(dataStoredInToken);
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
    if (user && user.tokens.find((x) => x.value === token)) {
      return user;
    }

    return null;
  }

  private async createUniqueToken(user: User): Promise<string> {
    return await bcrypt.hash(
      _.toString({
        username: user.username,
        password: user.password,
      }),
      this.salt,
    );
  }

  private async cleanUpUniqueTokens(tokens: Token[]) {
    await Promise.all(
      tokens
        .filter((x) => DateTime.local() <= DateTime.fromJSDate(x.expiresIn))
        .map((x) => this.tokenService.delete(x.id)),
    );
  }
}

export default AuthService;
