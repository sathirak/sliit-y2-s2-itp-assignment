import { NestFactory } from '@nestjs/core';
import { Logger as AppLogger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { PORT } from 'src/consts';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = new Logger('NestApplication');

  app.useLogger(app.get(AppLogger));

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
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
        title: 'Cats | API Reference',
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
