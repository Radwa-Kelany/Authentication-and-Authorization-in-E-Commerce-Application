import { StatusCodes } from 'http-status-codes';
import { loginSchema } from './login.validation';

import { Request, Response, NextFunction } from 'express';

export const loginInputValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      Message: 'Validation failed',
      errors: result.error.issues,
    });
  }
};
