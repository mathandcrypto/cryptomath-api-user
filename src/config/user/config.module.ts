import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { UserConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        USER_REGISTER_CONFIRM_MAX_AGE: Joi.number().min(5).max(60),
      }),
    }),
  ],
  providers: [ConfigService, UserConfigService],
  exports: [UserConfigService],
})
export class UserConfigModule {}
