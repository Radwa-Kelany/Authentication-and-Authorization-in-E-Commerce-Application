import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { errorMessage } from '../../../error/error.message';

export const requireRoleMiddleware =
  (...allowedRoleIds: number[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.roleId)
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: errorMessage.NOT_AUTHORIZED.message });
    const { roleId } = req.body;

    const hasRole = allowedRoleIds.includes(roleId);

    if (!hasRole) {
      return res.status(StatusCodes.FORBIDDEN).json({
       error: errorMessage.FORBIDDEN.message
      });
    }

    next();
  };

export default requireRoleMiddleware;
