import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();
}

let isInitialized = false;

export default async (req: any, res: any) => {
  console.log('Incoming request:', req.method, req.url);
  if (!isInitialized) {
    console.log('Initializing NestJS app...');
    try {
      await bootstrap();
      isInitialized = true;
      console.log('NestJS app initialized successfully');
    } catch (error) {
      console.error('Error initializing NestJS app:', error);
      return res.status(500).send('Error initializing app');
    }
  }
  console.log('Handling request with Express server');
  server(req, res);
};
