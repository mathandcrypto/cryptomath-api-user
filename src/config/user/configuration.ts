import { registerAs } from '@nestjs/config';

export default registerAs('user', () => ({
  registerConfirmMaxAge: process.env.USER_REGISTER_CONFIRM_MAX_AGE,
}));