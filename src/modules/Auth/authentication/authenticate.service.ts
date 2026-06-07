import ms, { StringValue } from 'ms';
import { Prisma, SessionRevocationReasonEnum } from '@prisma/client';
import { HashPassword } from '../helpers/hashPassword';
import { createToken, verifyToken } from '../helpers/jwt';
import { loginDTO } from './authenticate.dto';
import dotenv from 'dotenv';
import { AuthRepository } from '../authRepository/auth.repository';
import prisma from '../../../../lib/prisma';
import { EmailService } from '../utils/emailService';
dotenv.config();

const authRepository = new AuthRepository();
const emailService = new EmailService();

export class AuthenticateService {
  async getUserByEmail(email: string) {
    const existingUser = await authRepository.getUserByEmail(email);
    if (!existingUser) throw new Error('Email or password are invalid');
    return existingUser;
  }
  async createRefreshToken(user: any) {
    try {
      const refreshToken = await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const session = await authRepository.createUserSession(
            {
              userId: user.id,
              expiresAt: new Date(
                Date.now() +
                  ms(process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue),
              ),
            },
            tx,
          );
          // refresh token payload is user id and session id
          const refreshToken = createToken(
            { userId: user.id, sessionId: session.id },
            process.env.REFRESH_TOKEN_EXPIRES_IN!,
            process.env.REFRESH_TOKEN_SECRET!,
          );
          // save in session table
          const updatedSession = await authRepository.updateUserSession(
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
      throw new Error('Error creating refresh token');
    }
  }
  async createAccessToken(user: any) {
    // access token:
    let accessToken;
    // access token payload is [user id and role id] in case of dashboard-user
    if (user.roleId) {
      accessToken = createToken(
        { userId: user.id, roleId: user.roleId },
        process.env.ACCESS_TOKEN_EXPIRES_IN!,
        process.env.ACCESS_TOKEN_SECRET!,
      );
    }
    // access token payload is user id and customer id in case of customer
    else {
      const customerId = await authRepository.getCustomerIdByUserId(user.id);
      if (!customerId) throw new Error('Customer not found');
      accessToken = createToken(
        { userId: user.id, customerId },
        process.env.ACCESS_TOKEN_EXPIRES_IN!,
        process.env.ACCESS_TOKEN_SECRET!,
      );
    }
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
      throw new Error('Email or password are invalid');
    }

    // create refresh token and access token and send to client
    const refreshToken = await this.createRefreshToken(existingUser);
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
    if (!decodedRefreshToken) throw new Error('Refresh token is invalid');
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
      throw new Error(
        'Session is invalid or expired or revoked, redirect to login page',
      );
    //  create access token and send back
    const existingUser = await authRepository.getUserById(
      decodedRefreshToken.userId,
    );
    if (!existingUser) throw new Error('User not found');

    const accessToken = await this.createAccessToken(existingUser);
    return { accessToken };
  }

  async logout(refreshToken: string) {
    const decodedRefreshToken = verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    );
    if (!decodedRefreshToken) throw new Error('Refresh token is invalid');
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
    if (!session) throw new Error('Session not found');
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
    console.log(user);
    if (!user) throw new Error('User not found');
    const resetToken = createToken(
      { userId: user.id },
      process.env.RESET_TOKEN_EXPIRES_IN!,
      process.env.RESET_TOKEN_SECRET!,
    );
console.log(resetToken);
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    // await emailService.sendPasswordResetEmail(user.email, resetLink);
  }
  async resetPassword(resetToken: string, newPassword: string) {
    const token = verifyToken(resetToken, process.env.RESET_TOKEN_SECRET!);
    if (!token) throw new Error('Token is invalid or expired');

    const user = await authRepository.getUserById(token.userId);
    if (!user) throw new Error('User not found');

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
