import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { swaggerConfig } from './infrastructures/swagger';



async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  await swaggerConfig(app);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Приложение запущено: ${await app.getUrl()}`);
}


bootstrap();
