import { Prisma, RoleEnum, UserTypeEnum } from '@prisma/client';
import { CustomerDTO, SellerDTO, UserDTO } from './register.dto';
import { HashPassword } from '../helpers/hashPassword';
import { EmailService } from '../utils/emailService';
import { AuthRepository } from '../authRepository/auth.repository';
import prisma from '../../../../lib/prisma';
import { verifyOTP } from '../helpers/otp';
import { OTPService } from './OTP.service';
import { OTP_ATTEMPTS } from './OTP.service';
import { BAD_REQUEST } from '../../../error/error.exeception';
import { errorMessage } from '../../../error/error.message';
import { isAllowedEmailProvider } from '../helpers/checkEmailDomain';

const authRepository = new AuthRepository();
const otpService = new OTPService();
const emailService = new EmailService();
export class RegisterService {
  async checkExistingEmail(userEmail: string): Promise<UserDTO | null> {
    const email = userEmail.toLowerCase();
    const existingUser = await authRepository.getUserByEmail(email);
    if (existingUser) throw new BAD_REQUEST(errorMessage.EMAIL_EXISTS.message);
    return existingUser;
  }
  async isEmailVerified(verified_token: string): Promise<string> {
    const verifiedEmail = await otpService.getVerifiedToken(verified_token);
    if (!verifiedEmail)
      throw new BAD_REQUEST(errorMessage.VERIFIED_TOKEN_NOT_FOUND.message);
    return verifiedEmail;
  }
  async sendOTP(email: string): Promise<{ session_token: string }> {
    const isAllowed = isAllowedEmailProvider(email);
    if (!isAllowed)
      throw new BAD_REQUEST(errorMessage.EMAIL_PROVIDER_NOT_ALLOWED.message);

    email = email.toLowerCase();
    const count = await otpService.checkOTPRateLimit(email);
    if (count > OTP_ATTEMPTS)
      throw new BAD_REQUEST(errorMessage.OTP_RATE_LIMIT.message);

    await this.checkExistingEmail(email);

    const { session_token, otp } = await otpService.setOTP(email);
    console.log(session_token, otp)
    if (!session_token)
      throw new BAD_REQUEST(errorMessage.OTP_FAILED_GENERATE.message);

    await emailService.sendOTPEmail(email, otp);

    return { session_token };
  }
  async verifyOTP(
    session_token: string,
    otp: string,
  ): Promise<{ verified_token: string, email: string }> {
    const session = await otpService.getOTP(session_token);
    if (!session)
      throw new BAD_REQUEST(errorMessage.OTP_EXPIRED_NOT_FOUND.message);

    if (session.attempts >= OTP_ATTEMPTS - 1) {
      await otpService.deleteOTP(session_token);
      throw new BAD_REQUEST(errorMessage.OTP_ATTEMPTS.message);
    }

    const isVerified = await verifyOTP(otp, session.otpHash);
    if (!isVerified) {
      await otpService.incrementOTPAttempts(session_token, session);
      const remainingAttempts = OTP_ATTEMPTS - (session.attempts + 1);
      throw new BAD_REQUEST(
        `${errorMessage.OTP_INVALID.message}. ${remainingAttempts} attempts left`,
      );
    }

    await otpService.deleteOTP(session_token);

    const verified_token = await otpService.setVerifiedToken(session.email);
    if (!verified_token)
      throw new BAD_REQUEST(
        errorMessage.VERIFIED_TOKEN_FAILED_GENERATE.message,
      );
    return { verified_token, email: session.email };
  }

  async createCustomer(user: CustomerDTO) {
    const verifiedEmail = await this.isEmailVerified(user.verified_token);
    const email = await this.checkExistingEmail(verifiedEmail);
    const hashedPassword = await HashPassword.hashPassword(user.password);
    user.password = hashedPassword;
    const dateOnly = new Date(`${user.dob}`);
    user.dob = dateOnly;

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      return await authRepository.createCustomer(user, tx);
    });
  }
  async createSeller(user: SellerDTO) {
    const verifiedEmail = await this.isEmailVerified(user.verified_token);
    const email = await this.checkExistingEmail(verifiedEmail);

    const hashedPassword = await HashPassword.hashPassword(user.password);
    user.password = hashedPassword;
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      return await authRepository.createSeller(user, tx);
    });
  }

  async getUserTypeIdByName(type: UserTypeEnum) {
    return await authRepository.getUserTypeIdByName(type);
  }
  async getRoleIdByName(Name: RoleEnum) {
    return await authRepository.getRoleIdByName(Name);
  }
}
