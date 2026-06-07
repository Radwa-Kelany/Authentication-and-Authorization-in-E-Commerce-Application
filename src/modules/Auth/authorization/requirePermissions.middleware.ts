import { Request, Response, NextFunction } from 'express';

import { PermissionEnum } from '@prisma/client';
import { PermissionService } from './permission.service';
const permissionService = new PermissionService();
export const requirePermissionsMiddleware =
  (...requiredPermissions: PermissionEnum[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.roleId)
      return res.status(401).json({ error: 'Unauthorized' });
    const { roleId } = req.body;

    // get permissions from db based on roleId
    const permissions = await permissionService.getPermissionsByRoleId(roleId);
    const permissionNames = permissions.map((permission) => permission.name);

    // simple check: ensure all requiredPermissions exist on role
    const hasAll = requiredPermissions.every((p) =>
      permissionNames.includes(p),
    );
    if (!hasAll) return res.status(401).json({ error: 'Unauthorized' });

    next();
  };

export default requirePermissionsMiddleware;
