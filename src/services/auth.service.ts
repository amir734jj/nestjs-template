import * as bcrypt from 'bcrypt';
import LoginUserDto from '../dtos/login.user.dto';
import {DataStoredInToken} from '../interfaces/auth.interface';
import {DateTime} from 'luxon';
import UserService from './users.service';
import CreateUserDto from '../dtos/create.user.dto';
import LogoutUserDto from '../dtos/logout.user.dto';
import User from '../models/users.model';
import TokenService from './token.service';
import {Injectable, Logger} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import * as _ from 'lodash';
import Token from '../models/token.model';
import ms from 'ms';
import {nanoid} from 'nanoid';
import RoleService from "./role.service";
import Role from "../models/roles.model";

@Injectable()
export default class AuthService {
  private readonly salt = 10;

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(userData: CreateUserDto): Promise<User> {
    const users = await this.userService.all();
    let roles = ['basic'];

    if (!users.length) {
      roles.push('admin');
    }

    return await this.userService.save({
      ...userData,
      password: await bcrypt.hash(userData.password, this.salt),
      roles: await Promise.all(roles.map(role => this.getOrCreateRole(role)))
    });
  }

  private async getOrCreateRole(name: string): Promise<Role> {
    const role = await this.roleService.find({ name });
    if (role) {
      return role;
    } else {
      return await this.roleService.save({ name });
    }
  }

  public async login(loginUserDto: LoginUserDto): Promise<string | null> {
    const user = await this.userService.find({
      username: loginUserDto.username,
    });
    if (user && (await bcrypt.compare(loginUserDto.password, user.password))) {
      // clean up old expired tokens of this user
      await this.cleanUpUniqueTokens(user.tokens);

      return this.refreshToken(user);
    }
    return null;
  }

  public async logout(logoutUserDto: LogoutUserDto): Promise<User | null> {
    const token = await this.tokenService.find({ value: logoutUserDto.token });
    if (token) {
      await this.tokenService.delete(token.id);

      return token.user;
    }

    return null;
  }

  public async challenge({
    tokenId,
    token: jwtToken,
  }: DataStoredInToken): Promise<User | null> {
    const token = await this.tokenService.find({ id: tokenId, value: jwtToken });
    if (token) {
      const minutesToExpire = DateTime.fromJSDate(token.expiresIn)
        .diff(DateTime.local())
        .as('minutes');

      if (minutesToExpire >= 1) {
        return await this.userService.get(token.user.id);
      } else {
        Logger.log('Token is expired.');
      }
    }

    Logger.log('Token not found');
    return null;
  }

  public async refreshToken(user: User): Promise<string> {
    const jwtToken = await this.createUniqueToken(user);

    const newToken = await this.tokenService.save({
      value: jwtToken,
      user,
      expiresIn: DateTime.local()
        .plus({
          milliseconds: ms(
              this.configService.getOrThrow<string>('JWT_EXPIRES'),
          ),
        })
        .toJSDate(),
    });

    const result=  await this.jwtService.signAsync(this.createTokenPayload(newToken.user, newToken));

    Logger.log('Token successfully refreshed');

    return result;
  }

  private async createUniqueToken(user: User): Promise<string> {
    return await bcrypt.hash(
      _.toString({
        random: nanoid(),
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
        .map(async (x) => await this.tokenService.delete(x.id)),
    );
  }

  private createTokenPayload(user: User, token: Token): DataStoredInToken {
    return {
      userId: user.id,
      tokenId: token.id,
      username: user.username,
      token: token.value,
    };
  }
}
