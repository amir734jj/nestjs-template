import * as bcrypt from 'bcrypt';
import LoginUserDto from '../dtos/login.user.dto';
import { DataStoredInToken } from '../interfaces/auth.interface';
import { DateTime } from 'luxon';
import UserService from './users.service';
import CreateUserDto from '../dtos/create.user.dto';
import User from '../models/users.model';
import TokenService from './token.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import Token from '../models/token.model';
import ms from 'ms';
import { nanoid } from 'nanoid';
import RoleService from './role.service';
import Role from '../models/roles.model';
import { ADMIN_ROLE, BASIC_ROLE } from '../constants/role.constant';
import { UserRole } from '../enums/role.enum';

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
    const roles = [BASIC_ROLE];

    if (!users.length) {
      roles.push(ADMIN_ROLE);
    }

    return await this.userService.save({
      ...userData,
      password: await bcrypt.hash(userData.password, this.salt),
      roles: await Promise.all(roles.map((role) => this.getOrCreateRole(role))),
    });
  }

  public async login(loginUserDto: LoginUserDto): Promise<string | null> {
    let user = await this.userService.find({
      username: loginUserDto.username,
    });
    if (user && (await bcrypt.compare(loginUserDto.password, user.password))) {
      // clean up old expired tokens of this user
      // if there was a change, then we need to refresh the user
      if (await this.cleanUpUniqueTokens(user.tokens)) {
        user = (await this.userService.get(user.id))!;
      }

      return this.refreshToken(user);
    }
    return null;
  }

  public async logout(user: User): Promise<User | null> {
    await Promise.all(user.tokens.map((tk) => this.tokenService.delete(tk.id)));

    return this.userService.get(user.id);
  }

  public async challenge({
    tokenId,
    token: jwtToken,
  }: DataStoredInToken): Promise<User | null> {
    const token = await this.tokenService.find({
      id: tokenId,
      value: jwtToken,
    });
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
    if (user.tokens.length >= 10) {
      throw new BadRequestException(
        'User cannot have more than 10 active JWT tokens.',
      );
    }

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

    const result = await this.jwtService.signAsync(
      this.createTokenPayload(newToken.user, newToken),
    );

    Logger.log('Token successfully refreshed');

    return result;
  }

  public async setUserRole(
    userId: number,
    role: UserRole,
  ): Promise<User | null> {
    const user = await this.userService.get(userId);

    if (!user) {
      Logger.log('Failed to find the user {}', userId);

      return null;
    }

    switch (role) {
      case UserRole.ADMIN:
        return this.setUserRoles(user, BASIC_ROLE, ADMIN_ROLE);
      case UserRole.BASIC:
        return this.setUserRoles(user, BASIC_ROLE);
    }
  }

  private async setUserRoles(
    user: User,
    ...roles: string[]
  ): Promise<User | null> {
    const extraRoles = _.chain(user.roles)
      .map((r) => r.name)
      .difference(roles)
      .value();
    const missingRoles = _.chain(roles)
      .differenceWith(user.roles, (value, role) => value === role.name)
      .value();

    user.roles = user.roles.filter((role) => !extraRoles.includes(role.name));
    user.roles = user.roles.concat(
      await Promise.all(missingRoles.map((role) => this.getOrCreateRole(role))),
    );

    // its counterintuitive but we need to use save (instead of update):
    // https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#deleting-many-to-many-relations
    return await this.userService.save(user);
  }

  private async getOrCreateRole(name: string): Promise<Role> {
    const role = await this.roleService.find({ name });
    if (role) {
      return role;
    } else {
      return await this.roleService.save({ name });
    }
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

  private async cleanUpUniqueTokens(tokens: Token[]): Promise<boolean> {
    const expiringTokens = tokens.filter(
      ({ expiresIn }) =>
        DateTime.fromJSDate(expiresIn).diff(DateTime.local()).as('minutes') < 0,
    );

    if (expiringTokens.length) {
      await Promise.all(
        expiringTokens.map(async (x) => await this.tokenService.delete(x.id)),
      );
      return true;
    }

    return false;
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
