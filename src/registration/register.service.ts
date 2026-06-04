import { RoleEnum, UserTypeEnum } from '@prisma/client';
import { CustomerDTO, SellerDTO, UserDTO } from './register.dto';
import { RegisterRepository } from './register.repository';
import { HashPassword } from './helpers/hashPassword';
const registerRepository = new RegisterRepository();
export class RegisterService {
  async checkUserEmail(userEmail: string) {
    const email = userEmail.toLowerCase();
    const existingUser = await registerRepository.getUserByEmail(email);
    if (existingUser) throw new Error('Email already exists');
  }
  async hashingPassword(userPassword: string) {
    let hashedPassword = await HashPassword.hashPassword(userPassword);
    return hashedPassword;
  }
  async createCustomer(user: CustomerDTO) {
    await this.checkUserEmail(user.email);
    const hashedPassword = await this.hashingPassword(user.password);
    user.password = hashedPassword;
    const createdCustomer = await registerRepository.createCustomer(user);
  }
  async createSeller(user: SellerDTO) {
    await this.checkUserEmail(user.email);
    const hashedPassword = await this.hashingPassword(user.password);
    user.password = hashedPassword;
    const createdSeller = await registerRepository.createSeller(user);
  }


  async getUserTypeIdByName(type: UserTypeEnum) {
    return await registerRepository.getUserTypeIdByName(type);
  }
  async getRoleIdByType(type: RoleEnum) {
    return await registerRepository.getRoleIdByName(type);
  }
}
