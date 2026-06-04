import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
export class HashPassword {
  static async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  static async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
