import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: ['http://localhost:5173', 'https://admin.socket.io', '*'],
    credentials: false,
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  const port = process.env.PORT || 3030;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
