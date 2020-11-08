import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import validateEnv from './utils/validateEnv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';

async function bootstrap() {
  // validateEnv();

  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Nest.js API')
    .setDescription('Simple MVC application')
    .setVersion('1.0')
    .addTag('user')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}

bootstrap();
