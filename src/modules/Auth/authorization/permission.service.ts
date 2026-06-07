import { AuthRepository } from '../authRepository/auth.repository';

const authRepository = new AuthRepository();
export class PermissionService {
  async getPermissionsByRoleId(roleId: number) {
    try {
      return await authRepository.getPermissionsByRoleId(roleId);
    } catch (error) {
      throw error;
    }
  }
}
