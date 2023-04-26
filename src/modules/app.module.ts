import { Module } from '@nestjs/common';
import DatabaseModule from './database.module';
import UserModule from './user.module';
import AuthModule from './auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot(), UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export default class AppModule {}
