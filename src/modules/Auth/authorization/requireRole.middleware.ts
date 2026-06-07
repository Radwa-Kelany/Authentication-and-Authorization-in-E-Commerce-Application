import { Request, Response, NextFunction } from 'express';

export const requireRoleMiddleware =
  (...allowedRoleIds: number[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.roleId)
      return res.status(401).json({ error: 'Unauthorized' });
    const { roleId } = req.body;

    const hasRole = allowedRoleIds.includes(roleId);

    if (!hasRole) {
      return res.status(403).json({
        message: 'Forbidden',
      });
    }

    next();
  };

export default requireRoleMiddleware;
