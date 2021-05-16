import { hash, compare } from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionService {
  async hash(plain: string, salt: string): Promise<string> {
    return hash(plain, salt);
  }

  async compare(plain: string, encrypted: string): Promise<boolean> {
    return compare(plain, encrypted);
  }
}
