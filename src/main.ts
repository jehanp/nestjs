import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TasksModule } from './tasks/tasks.module';

async function bootstrap() {
  const app = await NestFactory.create(TasksModule);
  await app.listen(3000);
}
bootstrap();
