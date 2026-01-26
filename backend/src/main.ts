import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(3000);

  console.log('Сервер запущен на http://localhost:3000');
  console.log('API доступен по http://localhost:3000/api');
  console.log('Регистрация: POST http://localhost:3000/api/auth/register');
  console.log('Логин:       POST http://localhost:3000/api/auth/login');
}
bootstrap();