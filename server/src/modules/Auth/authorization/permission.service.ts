import { PermissionEnum } from '@prisma/client';
import { AuthRepository } from '../authRepository/auth.repository';

const authRepository = new AuthRepository();
export class PermissionService {
  async hasPermissionsByRoleId(roleId: number, permissionsName: PermissionEnum[]) {
    try {
      return await authRepository.hasPermissionByRoleId(roleId, permissionsName);
    } catch (error) {
      throw error;
    }
  }
}
