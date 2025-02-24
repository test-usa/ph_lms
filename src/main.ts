/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { UserSeeder } from './seed/admin.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('PH - Learning Management System')
    .setDescription('PH_LMS API description')
    .setVersion('1.0')
    .addTag('Content, Module')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    Credential:true,
    origin:["*"]
  })
  const seeder = app.get(UserSeeder);
  await seeder.seedAdmin();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
