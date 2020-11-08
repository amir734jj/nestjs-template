import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../models/token.model';
import { User } from '../models/users.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Token, User],
      synchronize: true,
      migrationsRun: true,
    }),
  ],
})
export class DatabaseModule {}
