import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const defaultOptions = {
          synchronize: true,
          migrationsRun: false,
          logging: false,
          autoLoadEntities: true,
          cache: true,
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
