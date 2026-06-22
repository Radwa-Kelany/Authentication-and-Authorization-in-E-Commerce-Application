import ms, { StringValue } from 'ms';
import { Prisma, SessionRevocationReasonEnum } from '@prisma/client';
import { HashPassword } from '../helpers/hashPassword';
import { createToken, verifyToken } from '../helpers/jwt';
import { loginDTO } from './authenticate.dto';
import dotenv from 'dotenv';
import { AuthRepository } from '../authRepository/auth.repository';
import prisma from '../../../../lib/prisma';
import { EmailService } from '../utils/emailService';
import { BAD_REQUEST, NOT_FOUND } from '../../../error/error.exeception';
import { errorMessage } from '../../../error/error.message';
dotenv.config();

const authRepository = new AuthRepository();
const emailService = new EmailService();

export class AuthenticateService {
  async getRoleNameById(id: number | null) {
    if (id === null) return null;
    const roleName = await authRepository.getRoleNameById(id);
    return roleName;
  }
  async getUserByEmail(email: string) {
    const existingUser = await authRepository.getUserByEmail(email);
    if (!existingUser)
      throw new BAD_REQUEST(errorMessage.INVALID_CREDENTIALS.message);
    return existingUser;
  }
  async createRefreshToken(user: any, device: string) {
    try {
      const refreshToken = await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const session = await authRepository.createUserSession(
            {
              userId: user.id,
              device,
              expiresAt: new Date(
                Date.now() +
                  ms(process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue),
              ),
            },
            tx,
          );
          // refresh token payload is user id and session id
          const payload = { sub: session.id };
          const expiration = process.env.REFRESH_TOKEN_EXPIRES_IN!;
          const refreshToken = createToken(
            payload,
            process.env.REFRESH_TOKEN_SECRET!,
            {
              expiresIn: expiration as StringValue,
              issuer: 'api.myapp.com',
              audience: 'myapp.com',
              jwtid: crypto.randomUUID(),
            },
          );
          // save in session table
          await authRepository.updateUserSession(
            session.id,
            {
              refreshToken,
            },
            tx,
          );
          return refreshToken;
        },
      );
      return refreshToken;
    } catch (error) {
      throw new BAD_REQUEST(errorMessage.FAILED_CREATE_TOKEN.message);
    }
  }
  async createAccessToken(user: any) {
    let accessToken;
    let payload;
    if (user.roleId) {
      const role = await this.getRoleNameById(user.roleId);
      payload = {
        sub: user.id,
        name: user.firstName,
        roles: [role?.name],
      };
    } else {
      const customer = await authRepository.getCustomerIdByUserId(user.id);
      if (!customer)
        throw new NOT_FOUND(errorMessage.CUSTOMER_NOT_FOUND.message);
      payload = {
        sub: customer.id,
        name: user.firstName,
      };
    }
    accessToken = createToken(payload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN! as StringValue,
      issuer: 'api.myapp.com',
      audience: 'myapp.com',
      jwtid: crypto.randomUUID(),
    });

    return accessToken;
  }
  async login(loginInput: loginDTO) {
    // get user by email
    const existingUser = await this.getUserByEmail(loginInput.email);
    // compare password with db password
    const passwordMatch = await HashPassword.comparePassword(
      loginInput.password,
      existingUser.password,
    );
    if (!passwordMatch) {
      throw new BAD_REQUEST(errorMessage.INVALID_CREDENTIALS.message);
    }
    // create refresh token and access token and send to client
    const refreshToken = await this.createRefreshToken(
      existingUser,
      loginInput.device,
    );
    const accessToken = await this.createAccessToken(existingUser);
    return { accessToken, refreshToken };
  }

  // For create new access token
  async refresh(refreshToken: string) {
    // decode refresh token
    const decodedRefreshToken = verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    );
    // expire ---error
    if (!decodedRefreshToken)
      throw new BAD_REQUEST(errorMessage.EXPIRED_INVALID_TOKEN.message);
    // get session id using user id--- expire or revoke  ---> error
    const session = await authRepository.getSessionById(
      decodedRefreshToken.sessionId,
    );
    if (
      !session ||
      session.refreshToken !== refreshToken ||
      session.refreshToken === null ||
      session?.expiresAt < new Date() ||
      session.revoked
    )
      throw new BAD_REQUEST(errorMessage.EXPIRED_INVALID_SESSION.message);
    //  create access token and send back
    // get user by sessionId
    const existingUser = await authRepository.getUserById(session.userId);
    if (!existingUser) throw new NOT_FOUND('User not found');

    // /payload for customer
    const accessToken = await this.createAccessToken(existingUser);
    return { accessToken };
  }

  async logout(refreshToken: string) {
    const decodedRefreshToken = verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    );
    if (!decodedRefreshToken) throw new BAD_REQUEST(errorMessage.EXPIRED_INVALID_TOKEN.message);
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await authRepository.updateUserSession(
        decodedRefreshToken.sessionId,
        {
          refreshToken: null,
          revoked: true,
          revokedAt: new Date(),
          revokedReason: SessionRevocationReasonEnum.USER_LOGOUT,
        },
        tx,
      );
    });
  }
  async revokeSession(
    sessionId: number,
    revokedReason: SessionRevocationReasonEnum,
  ) {
    const session = await authRepository.getSessionById(sessionId);
    if (!session) throw new NOT_FOUND(errorMessage.SESSION_NOT_FOUND.message);
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await authRepository.updateUserSession(
        sessionId,
        {
          refreshToken: null,
          revoked: true,
          revokedAt: new Date(),
          revokedReason,
        },
        tx,
      );
    });
  }
  async revokeAllUserSessions(
    userId: number,
    revokedReason: SessionRevocationReasonEnum,
  ) {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await authRepository.updateAllUserSessions(
        userId,
        {
          refreshToken: null,
          revoked: true,
          revokedAt: new Date(),
          revokedReason,
        },
        tx,
      );
    });
  }

  async forgetPassword(email: string) {
    const user = await authRepository.getUserByEmail(email);
    if (!user) throw new NOT_FOUND(errorMessage.USER_NOT_FOUND.message);
    const resetToken = createToken(
      { sub: user.id },
      process.env.RESET_TOKEN_SECRET!,
      {
        expiresIn: process.env.RESET_TOKEN_EXPIRES_IN! as StringValue,
        issuer: 'api.myapp.com',
        audience: 'myapp.com',
        jwtid: crypto.randomUUID(),
      },
    );
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    await emailService.sendPasswordResetEmail(user.email, resetLink);
  }
  async resetPassword(resetToken: string, newPassword: string) {
    const token = verifyToken(resetToken, process.env.RESET_TOKEN_SECRET!);
    if (!token) throw new BAD_REQUEST(errorMessage.EXPIRED_INVALID_TOKEN.message);

    const user = await authRepository.getUserById(token.userId);
    if (!user) throw new NOT_FOUND(errorMessage.USER_NOT_FOUND.message);

    const hashedPassword = await HashPassword.hashPassword(newPassword);
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await authRepository.updateUserPassword(user.id, hashedPassword, tx);
      await this.revokeAllUserSessions(
        token.userId,
        SessionRevocationReasonEnum.PASSWORD_RESET,
      );
    });
  }
}
