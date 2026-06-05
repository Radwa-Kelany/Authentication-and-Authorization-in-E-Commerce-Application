import prisma from '../../../lib/prisma';
import { loginDTO, sessionDTO } from './login.dto';

export class LoginRepository {
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
  async createUserSession(sessionInput: sessionDTO) {
    return await prisma.userSession.create({
      data: sessionInput,
    });
  }

  async getCustomerIdByUserId(userId: number) {
    return await prisma.customer.findUnique({
      where: { userId },
      select: { id: true },
    });
  }
}
