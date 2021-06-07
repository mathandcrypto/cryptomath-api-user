import { NestFactory } from '@nestjs/core';
import { AppConfigService } from '@config/app/config.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { USER_PACKAGE_NAME } from 'cryptomath-api-proto/types/user';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfigService = app.get(AppConfigService);

  const { protoFile, url } = appConfigService;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: USER_PACKAGE_NAME,
      protoPath: join(
        process.cwd(),
        'node_modules/cryptomath-api-proto/proto/',
        protoFile,
      ),
      url,
    },
  });

  await app.init();

  app.enableShutdownHooks();

  app.startAllMicroservices(() =>
    console.log(`User microservice is listening on ${url}`),
  );
}
bootstrap();
