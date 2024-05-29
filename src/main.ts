import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import {
  APM_MIDDLEWARE,
  ApmErrorInterceptor,
  ApmHttpUserContextInterceptor,
  initializeAPMAgent,
} from 'elastic-apm-nest';

initializeAPMAgent({
  serviceName: process.env.ELASTIC_APM_SERVICE_NAME,
  serverUrl: process.env.ELASTIC_APM_SERVER_URL,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: WinstonModule.createLogger({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
  });

  const logger = WinstonModule.createLogger({
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Order Mngt API')
    .setDescription('Manage orders and interactions with Magento backend')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'Bearer',
          schema: {
            type: 'http',
            in: 'header',
            name: 'Authorization',
            description: 'Enter JWT token',
          },
          value: 'Bearer <JWT>',
        },
      },
    },
  });

  const apmMiddleware = app.get(APM_MIDDLEWARE);
  const globalInterceptors = [
    app.get(ApmHttpUserContextInterceptor),
    app.get(ApmErrorInterceptor),
  ];
  app.useGlobalInterceptors(...globalInterceptors);
  app.use(apmMiddleware);

  await app.listen(3002);

  logger.log('Server running on http://localhost:3002');

  const signals = {
    SIGHUP: 1,
    SIGINT: 2,
    SIGTERM: 15,
  };
  const shutdown = async (signal, value) => {
    logger.log('shutdown!');
    await app.close();
    logger.log(`server stopped by ${signal} with value ${value}`);
    process.exit(128 + value);
  };
  Object.keys(signals).forEach((signal) => {
    process.on(signal, () => {
      logger.log(`process received a ${signal} signal`);
      shutdown(signal, signals[signal]);
    });
  });
}

bootstrap();
