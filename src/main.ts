import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { USER_PACKAGE_NAME } from 'cryptomath-api-proto/proto/build/user';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: USER_PACKAGE_NAME,
        protoPath: join(
          process.cwd(),
          'node_modules/cryptomath-api-proto/proto/user.proto',
        ),
        url: 'localhost:5001',
      },
    },
  );
  app.listen(() => console.log('User microservice is listening'));
}
bootstrap();
