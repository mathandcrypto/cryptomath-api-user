import { v4 as uuidv4 } from 'uuid';
import { hash, compare, genSalt } from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionService {
  async hash(plain: string): Promise<string> {
    const salt = await genSalt(11);

    return hash(plain, salt);
  }

  async compare(plain: string, encrypted: string): Promise<boolean> {
    return compare(plain, encrypted);
  }

  async generateConfirmationSecret(email: string): Promise<string> {
    const uuid = uuidv4();
    const plain = email + uuid;
    const salt = await genSalt(9);

    return hash(plain, salt);
  }
}
