import { Prisma } from '@prisma/client';
import { AuthRepository } from '../../src/modules/Auth/authRepository/auth.repository';
import prisma from '../../lib/prisma';
import dotenv from 'dotenv';

dotenv.config();
const userData = {
  firstName: 'test',
  lastName: 'test1',
  email: 'test@test.com',
  password: 'hash',
  phone: '0111111111111',
  userTypeId: 1,
};
const customerData = {
  ...userData,
  dob: new Date(),
  gender: 'male',
};

const authRepository = new AuthRepository();
describe('Auth Repository', () => {
  beforeEach(async () => {
    // delete dependent records first to avoid FK RESTRICT errors
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
  describe('getUserById', () => {
    it('should find user by id', async () => {
      const newUser = await prisma.user.create({
        data: userData,
      });

      const user = await authRepository.getUserById(newUser.id);
      expect(user).toEqual(newUser);
    });
    it('should return null if user not found', async () => {
      const newUser = await prisma.user.create({
        data: userData,
      });

      const user = await authRepository.getUserById(200);
      expect(user).toBeNull();
    });
    it('should throw when prisma fails', async () => {
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockRejectedValue(new Error('Database error'));

      await expect(authRepository.getUserById(200)).rejects.toThrow(
        'Database error',
      );
    });
  });
  describe('getUserByEmail', () => {
    it('should find user by id', async () => {
      const newUser = await prisma.user.create({
        data: userData,
      });

      const user = await authRepository.getUserByEmail(newUser.email);
      expect(user).toEqual(newUser);
    });

    it('should return null if email not found', async () => {
      const newUser = await prisma.user.create({
        data: userData,
      });

      const user = await authRepository.getUserByEmail('wrongEmail@test.com');
      expect(user).toBeNull();
    });
    it('should throw when prisma fails', async () => {
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        authRepository.getUserByEmail('test@test.com'),
      ).rejects.toThrow('Database error');
    });
  });
  describe('createUser', () => {
    it('should create user', async () => {
      const newUser = await authRepository.createUser(userData);
      await expect(newUser.email).toEqual(userData.email);
    });

    it('should return error in missing data', async () => {
      await expect(authRepository.createUser({} as any)).rejects.toThrow();
    });
    it('should return error in break constraint unique', async () => {
      await prisma.user.create({ data: userData });
      await expect(
        authRepository.createUser(userData as any),
      ).rejects.toThrow();
      await expect(
        authRepository.createUser(userData as any),
      ).rejects.toMatchObject({
        code: 'P2002',
      });
    });
    it('should throw when prisma fails', async () => {
      jest
        .spyOn(prisma.user, 'create')
        .mockRejectedValue(new Error('Database error'));

      await expect(authRepository.createUser(userData)).rejects.toThrow(
        'Database error',
      );
    });
  });
  describe('updateUserPassword', () => {
    it('should update user password', async () => {
      const newUser = await prisma.user.create({
        data: userData,
      });

      await authRepository.updateUserPassword(
        newUser.id,
        'newPassword',
        prisma,
      );
      const updatedUser = await prisma.user.findUnique({
        where: { id: newUser.id },
      });
      expect(updatedUser?.password).toEqual('newPassword');
    });
    it('should throw when prisma fails', async () => {
      jest
        .spyOn(prisma.user, 'update')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        authRepository.updateUserPassword(1, 'newPassword', prisma),
      ).rejects.toThrow('Database error');
    });
  });

  describe('createCustomer', () => {
    it('should create customer', async () => {
      const newCustomer = await authRepository.createCustomer(
        customerData,
        prisma,
      );
      await expect(newCustomer.email).toEqual(userData.email);
    });
    it('should return error in missing data', async () => {
      await expect(
        authRepository.createCustomer({} as any, prisma),
      ).rejects.toThrow();
    });
    it('should return error in break constraint unique', async () => {
      await authRepository.createCustomer(customerData, prisma);
      await expect(
        authRepository.createCustomer(customerData, prisma),
      ).rejects.toThrow();
      await expect(
        authRepository.createUser(userData as any),
      ).rejects.toMatchObject({
        code: 'P2002',
      });
    });
    it('should throw when prisma fails', async () => {
      jest
        .spyOn(prisma.user, 'create')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        authRepository.createCustomer(customerData, prisma),
      ).rejects.toThrow('Database error');
    });
  });

  describe('getCustomerByUserId', () => {
    it('should find customer by user id', async () => {
      const newUser = await prisma.user.create({
        data: userData,
      });
      const newCustomer = await prisma.customer.create({
        data: {
          userId: newUser.id,
          dob: new Date(),
          gender: 'male',
        },
      });

      const customer = await authRepository.getCustomerIdByUserId(newUser.id);

      expect(customer?.id).toEqual(newCustomer.id);
    });
    it('should return null if customer not found', async () => {
      const newUser = await prisma.user.create({
        data: userData,
      });
      const newCustomer = await prisma.customer.create({
        data: {
          userId: newUser.id,
          dob: new Date(),
          gender: 'male',
        },
      });
      const customer = await authRepository.getCustomerIdByUserId(1000);
      expect(customer).toBeNull();
    });
    it('should throw when prisma fails', async () => {
      jest
        .spyOn(prisma.customer, 'findUnique')
        .mockRejectedValue(new Error('Database error'));

      await expect(authRepository.getCustomerIdByUserId(200)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
