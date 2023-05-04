import { Module } from '@nestjs/common';
import DatabaseModule from './database.module';
import UserModule from './user.module';
import AuthModule from './auth.module';
import { ConfigModule } from '@nestjs/config';
import HealthModule from './health.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    HealthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client'),
    }),
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {}
