import { NestFactory, Reflector } from '@nestjs/core';
import AppModule from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const options = new DocumentBuilder()
    .setTitle('Nest.js API')
    .setDescription('Simple MVC application')
    .setVersion('1.0')
    .addTag('user')
    .addBearerAuth()
    .build();

  const port = config.get<number>('PORT') || 3000;

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  Logger.log(`Starting the app in port ${port}`);

  await app.listen(port);
}

bootstrap();
