import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppConfigService } from '@config/app/config.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { USER_PACKAGE_NAME } from '@cryptomath/cryptomath-api-proto/types/user';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
  const appConfigService = app.get(AppConfigService);

  const { protoFile, url } = appConfigService;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: USER_PACKAGE_NAME,
      protoPath: join(
        process.cwd(),
        'node_modules/@cryptomath/cryptomath-api-proto/proto/',
        protoFile,
      ),
      url,
    },
  });

  await app.init();

  app.enableShutdownHooks();

  await app.startAllMicroservices();

  logger.log(`User microservice is listening on ${url}`);
}
bootstrap();
