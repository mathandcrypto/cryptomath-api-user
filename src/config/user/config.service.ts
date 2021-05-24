import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserConfigService {
  constructor(private configService: ConfigService) {}

  get registerConfirmMaxAge(): number {
    return this.configService.get<number>('user.registerConfirmMaxAge');
  }

  get registerConfirmExpirationDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + this.registerConfirmMaxAge);

    return date;
  }
}
