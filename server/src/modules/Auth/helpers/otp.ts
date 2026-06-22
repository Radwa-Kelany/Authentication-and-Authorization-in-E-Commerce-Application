import * as bcrypt from 'bcrypt';
import crypto from 'crypto';


export function generateOTP() {
  return String(crypto.randomInt(100000, 999999));
}


export async function hashOTP(otp:string) {
  return bcrypt.hash(otp, 10);
}


export async function verifyOTP(otp:string, hash:string) {
  return bcrypt.compare(otp, hash);
}
