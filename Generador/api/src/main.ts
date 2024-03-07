import { RadarApiKeyGuard } from './auth/guards/radar-api-key.guard';
import { JwtGuard } from './auth/guards/jwt.guard';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UserGuard } from './auth/guards/user.guard';
import { ApiKeyGuard } from './auth/guards/api-key.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const reflector = new Reflector();

  app.useGlobalGuards(
    new ApiKeyGuard(reflector),
    new JwtGuard(reflector),
    new UserGuard(reflector),
    new RadarApiKeyGuard(reflector),
  );

  const config = new DocumentBuilder()
    .setTitle('Doppler Api')
    .setDescription(
      'Documentación de API para manejo de información de Dopple Solutions',
    )
    .addSecurity('employer', {
      type: 'http',
    })
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors();
  await app.listen(8000);
}
bootstrap();
