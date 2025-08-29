import * as dotenv from 'dotenv';

dotenv.config();

import { NestFactory } from '@nestjs/core';
import { Logger as AppLogger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { PORT } from 'src/consts';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = new Logger('NestApplication');

  app.useLogger(app.get(AppLogger));

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ITP Assignment API')
    .setDescription('API for ITP Assignment with Products, Users, Orders, and Tickets management')
    .setVersion('1.0')
    .addTag('products', 'Product management endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('orders', 'Order management endpoints')
    .addTag('tickets', 'Ticket management endpoints')
    .addTag('health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('reference', app, document, { swaggerUiEnabled: false });
  app.use(
    '/reference',
    apiReference({
      theme: 'default',
      authentication: {
        preferredSecurityScheme: 'bearer',
      },
      metaData: {
        title: 'ITP Assignment | API Reference',
      },
      content: document,
      favicon: 'https://cats.com/favicon.ico',
      hideClientButton: true,
      hideDownloadButton: true,
    }),
  );

  await app.listen(PORT, () => {
    logger.log(`Server is running on http://localhost:${PORT}`);
    logger.log(
      `API Reference is available at http://localhost:${PORT}/reference`,
    );
    logger.log(`Health check available at http://localhost:${PORT}/health`);
    logger.log('✅ Application started successfully');
  });
}
bootstrap();
