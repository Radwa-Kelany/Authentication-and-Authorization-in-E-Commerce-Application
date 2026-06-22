import redis from '../../../../config/redis';
import { generateOTP, hashOTP } from '../helpers/otp';
import { randomUUID } from 'crypto';

export const OTP_TTL = Number(process.env.OTP_EXPIRES_SECONDS) || 600; // 10 min
export const VERIFIED_TTL =
  Number(process.env.VERIFIED_TOKEN_EXPIRES_SECONDS) || 900; // 15
export const RATE_LIMIT_TTL =
  Number(process.env.RATE_LIMIT_EXPIRES_SECONDS) || 3600; // 1 hour
export const OTP_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS) || 3;

// keys
const OTPKey = (session_token: string) => `reg:otp:${session_token}`;
const verifyTokenKey = (verify_token: string) => `reg:verify:${verify_token}`;
const rateLimitKey = (email: string) => `reg:rate_limit:${email}`;
export class OTPService {
  async checkOTPRateLimit(email: string) {
    const key = rateLimitKey(email);
    // Here we create the key if it doesn't exist and set it to 1
    // then in the following requests we will increment it
    const count = await redis.incr(key);
    // Here we set expiration time to rate key 1 hour only once at first request
    if (count === 1) {
      await redis.expire(key, RATE_LIMIT_TTL);
    }
    return count;
  }

  async setOTP(email: string) {
    const session_token = randomUUID();
    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    await redis.set(
      OTPKey(session_token),
      JSON.stringify({ email, otpHash, attempts: 0 }),
      'EX',
      OTP_TTL,
    );
    return { session_token, otp };
  }
  async getOTP(session_token: string) {
    const session = await redis.get(OTPKey(session_token));
    const data = session ? JSON.parse(session) : null;
    return data;
  }
  async deleteOTP(session_token: string) {
    await redis.del(OTPKey(session_token));
  }

  async incrementOTPAttempts(session_token: string, currentSession: any) {
    const ttl = await redis.ttl(OTPKey(session_token));
    await redis.set(
      OTPKey(session_token),
      JSON.stringify({
        ...currentSession,
        attempts: currentSession.attempts + 1,
      }),
      'EX',
      ttl > 0 ? ttl : OTP_TTL,
    );
  }

  async setVerifiedToken(email: string) {
    const verify_token = randomUUID();
    await redis.set(verifyTokenKey(verify_token), email, 'EX', VERIFIED_TTL);
    return verify_token;
  }

  async getVerifiedToken(verified_token: string) {
    const email = await redis.get(verifyTokenKey(verified_token));
    if (!email) return null;
    await redis.del(verifyTokenKey(verified_token)); // single-use: delete on read
    return email;
  }
}
