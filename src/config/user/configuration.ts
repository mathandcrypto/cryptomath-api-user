import { registerAs } from '@nestjs/config';
import { UserConfig } from './interfaces/user-config.interface';

export default registerAs<UserConfig>('user', () => ({
  registerConfirmMaxAge: Number(process.env.USER_REGISTER_CONFIRM_MAX_AGE),
}));
