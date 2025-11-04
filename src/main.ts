import { HttpAdapterHost, ModuleRef, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { RabbitMQProvider } from './rabbitmq.provider';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
// import { GqlRpcExceptionFilter } from './jwt/custom-exception.filter';
import { GlobalHttpExceptionFilter } from './common/error/http-exception.filter';
import { GlobalGqlExceptionFilter } from './common/error/gql-exception.filter';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { logger: ['error', 'warn', 'log', 'debug', 'verbose'] },
  );

  // Serve static files from the "public" directory
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Handle favicon.ico requests from browsers to prevent 404 errors in logs  
  app.use('/favicon.ico', (req, res) => {
    res.status(204).send();
  });

    app
    .getHttpAdapter()
    .get('/', (req: express.Request, res: express.Response) => res.send('OK'));


  app.use(express.json({ limit: '50mb' })); 
  app.use(express.urlencoded({ limit: '50mb', extended: true })); 

  const rawOrigins = [process.env.FRONTEND_URL, process.env.DEV_FRONTEND_URL, process.env.WEBSITE_FRONTEND_URL];

  // Filter out any falsy/undefined values
  const allowedOrigins = rawOrigins.filter((url): url is string =>
    Boolean(url),
  );

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        console.error('Validation errors:', errors);
        return new BadRequestException(
          errors.map((e) => ({
            field: e.property,
            constraints: e.constraints,
          })),
        );
      },
    }),
  );

  // Get the RabbitMQProvider from the app's context
  // const rabbitMQProvider = app.get(RabbitMQProvider);

  // Use the provider to create the RabbitMQ microservice connection
  // const rmqOptions = rabbitMQProvider.createOptions('API_GATEWAY_QUEUE');
  // app.connectMicroservice(rmqOptions);

  // Start all microservices and the main app
  // app.useGlobalFilters(new RpcExceptionFilter());
  // await app.startAllMicroservices();
  app.useGlobalFilters(
    new GlobalHttpExceptionFilter(),
    new GlobalGqlExceptionFilter(),
  );
  // app.useGlobalFilters(new GqlRpcExceptionFilter());
  await app.listen(process.env.PORT ?? 3008);

  console.log(`API Gateway is running on port ${process.env.PORT ?? 3008}`);
}

bootstrap();
