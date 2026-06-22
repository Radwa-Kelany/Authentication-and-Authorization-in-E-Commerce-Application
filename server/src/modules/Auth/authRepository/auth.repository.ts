import { Prisma, RoleEnum, UserTypeEnum, PermissionEnum } from '@prisma/client';
import prisma from '../../../../lib/prisma';
import { CustomerDTO, SellerDTO, UserDTO } from '../registration/register.dto';
import { sessionDTO } from '../authentication/authenticate.dto';

export class AuthRepository {
  // User Model
  async getUserById(id: number) {
    return await prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async createUser(user: UserDTO) {
    return await prisma.user.create({ data: user });
  }
  async updateUserPassword(
    id: number,
    password: string,
    tx: Prisma.TransactionClient,
  ) {
    return await tx.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
  }

  // Customer Model
  async getCustomerIdByUserId(userId: number) {
    return await prisma.customer.findUnique({
      where: { userId },
      select: { id: true },
    });
  }
  async createCustomer(user: CustomerDTO, tx: Prisma.TransactionClient) {
    const customer = await tx.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        phone: user.phone,
        userTypeId: user.userTypeId,
        customer: {
          create: {
            dob: user.dob,
            gender: user.gender,
          },
        },
      },
      include: { customer: true },
    });
    return customer;
  }

  // Seller Model
  async createSeller(user: SellerDTO, tx: Prisma.TransactionClient) {
    return await tx.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        phone: user.phone,
        userTypeId: user.userTypeId,
        roleId: user.roleId,
        seller: {
          create: {
            storeName: user.storeName,
            storeSlug: user.storeSlug,
            businessName: user.businessName,
            businessNumber: user.businessNumber,
            taxNumber: user.taxNumber,
          },
        },
      },
      include: { seller: true },
    });
  }

  // User Type Model
  async getUserTypeIdByName(type: UserTypeEnum) {
    return await prisma.userType.findUnique({ where: { name: type } });
  }
  async getUserTypeById(id: number) {
    return await prisma.userType.findUnique({ where: { id } });
  }

  // Role Model

  async getRoleIdByName(type: RoleEnum) {
    return await prisma.role.findUnique({ where: { name: type } });
  }
  async getRoleNameById(id: number) {
    return await prisma.role.findUnique({ where: { id } });
  }

  // Session Model

  async getSessionById(id: number) {
    return await prisma.userSession.findUnique({ where: { id } });
  }
  async createUserSession(
    sessionInput: sessionDTO,
    tx: Prisma.TransactionClient,
  ) {
    const existingSession = await tx.userSession.findFirst({
      where: {
        userId: sessionInput.userId,
        device: sessionInput.device,
      },
    });

    if (existingSession) {
      return await tx.userSession.update({
        where: {
          id: existingSession.id,
        },
        data: {},
      });
    }

    return await tx.userSession.create({
      data: sessionInput,
    });
  }
  async updateUserSession(
    id: number,
    updatedData: any,
    tx: Prisma.TransactionClient,
  ) {
    await tx.userSession.update({
      where: {
        id,
      },
      data: {
        ...updatedData,
      },
    });
  }
  async updateAllUserSessions(
    userId: number,
    updatedData: any,
    tx: Prisma.TransactionClient,
  ) {
    await tx.userSession.updateMany({
      where: {
        userId,
      },
      data: {
        ...updatedData,
      },
    });
  }

  // Permission Model

  async hasPermissionByRoleId(
    roleId: number,
    permissionNames: PermissionEnum[],
  ) {
    return await prisma.permission.findFirst({
      where: {
        name: {
          in: permissionNames,
        },

        permissionGroups: {
          some: {
            permissionGroup: {
              roles: {
                some: {
                  roleId,
                },
              },
            },
          },
        },
      },
      select: {
        name: true,
      },
    });
  }
}
