import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Token from '../models/token.model';
import User from '../models/users.model';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const defaultOptions = {
          entities: [Token, User],
          synchronize: true,
          migrationsRun: true,
          logging: false,
        };

        if (configService.get<string>('ENV') === 'Development') {
          return {
            ...defaultOptions,
            type: 'sqlite',
            database: 'database.sqlite',
          };
        } else {
          return {
            ...defaultOptions,
            cache: true,
            type: 'postgres',
            url: configService.get<string>('DATABASE_URL'),
            extra: {
              ssl: true,
            },
          };
        }
      },
    }),
  ],
})
export default class DatabaseModule {}
