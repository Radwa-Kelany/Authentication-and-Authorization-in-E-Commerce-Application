import { Prisma, RoleEnum, UserTypeEnum } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { CustomerDTO, SellerDTO, UserDTO } from './register.dto';

export class RegisterRepository {
  async createUser(user: UserDTO) {
    return await prisma.user.create({ data: user });
  }
  async createCustomer(user: CustomerDTO) {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newUser = await tx.user.create({ data: user });
      await tx.customer.create({
        data: {
          dob: user.dob,
          gender: user.gender,
          userId: newUser.id,
        },
      });
    });
  }
  async createSeller(user: SellerDTO) {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newUser = await tx.user.create({ data: user });
      await tx.seller.create({
        data: {
          storeName: user.storeName,
          storeSlug: user.storeSlug,
          businessName: user.businessName,
          businessNumber: user.businessNumber,
          taxNumber: user.taxNumber,
          userId: newUser.id,
        },
      });
    });
  }
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }
  async getUserTypeIdByName(type: UserTypeEnum) {
    return await prisma.userType.findUnique({ where: { name: type } });
  }
  async getUserTypeById(id: number) {
    return await prisma.userType.findUnique({ where: { id } });
  }

  async getRoleIdByName(type: RoleEnum) {
    return await prisma.role.findUnique({ where: { name: type } });
  }
}
