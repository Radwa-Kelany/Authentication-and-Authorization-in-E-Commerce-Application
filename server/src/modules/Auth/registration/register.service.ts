import { Prisma, RoleEnum, UserTypeEnum } from '@prisma/client';
import { CustomerDTO, SellerDTO, UserDTO } from './register.dto';
import { HashPassword } from '../helpers/hashPassword';
import { AuthRepository } from '../authRepository/auth.repository';
import prisma from '../../../../lib/prisma';

const authRepository = new AuthRepository();
export class RegisterService {
  async checkExistingEmail(userEmail: string) {
    const email = userEmail.toLowerCase();
    const existingUser = await authRepository.getUserByEmail(email);
    if (existingUser) throw new Error('Email already exists');
  }
  async createCustomer(user: CustomerDTO) {
    await this.checkExistingEmail(user.email);
    const hashedPassword = await HashPassword.hashPassword(user.password);
    user.password = hashedPassword;
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      return await authRepository.createCustomer(user,tx);
    });
  }
  async createSeller(user: SellerDTO) {
    const email = await this.checkExistingEmail(user.email);

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
