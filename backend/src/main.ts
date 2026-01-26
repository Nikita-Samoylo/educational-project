import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            
      forbidNonWhitelisted: true,  
      transform: true,              
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);

  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📍 API доступен по http://localhost:${PORT}/api`);
}
bootstrap();