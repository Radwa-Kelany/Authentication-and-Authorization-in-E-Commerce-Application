import { Request, Response, NextFunction } from 'express';

import { PermissionEnum } from '@prisma/client';
import { PermissionService } from './permission.service';
import { StatusCodes } from 'http-status-codes';
import { errorMessage } from '../../../error/error.message';
const permissionService = new PermissionService();
export const requirePermissionsMiddleware =
  (...requiredPermissions: PermissionEnum[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.roleId)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: errorMessage.NOT_AUTHORIZED.message });
    const { roleId } = req.body;

    // get permissions from db based on roleId
    const permissions = await permissionService.hasPermissionsByRoleId(
      roleId,
      requiredPermissions,
    );
    if (!permissions)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: errorMessage.FORBIDDEN.message });
        
    const permissionsArray = Object.values(permissions);

    // simple check: ensure all requiredPermissions exist on role
    const hasAll = requiredPermissions.every((p) =>
      permissionsArray.includes(p),
    );
    if (!hasAll)
      return res.status(StatusCodes.FORBIDDEN).json({
        error: errorMessage.FORBIDDEN.message,
      });

    next();
  };

export default requirePermissionsMiddleware;
