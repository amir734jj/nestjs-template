import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserModule } from './user.module';
import AuthService from '../services/auth.service';
import { LocalStrategy } from '../logic/local-strategy.passport';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountController } from '../controllers/account.controller';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES') },
        };
      },
    }),
  ],
  controllers: [AccountController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
