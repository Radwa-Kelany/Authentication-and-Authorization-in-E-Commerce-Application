import { StatusCodes } from 'http-status-codes';
import {
  forgetPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from './authenticate.validation';

import { Request, Response, NextFunction } from 'express';

import { verifyToken } from '../helpers/jwt';
import { AuthenticateService } from './authenticate.service';
import { AuthRepository } from '../authRepository/auth.repository';
import { errorMessage } from '../../../error/error.message';
const authenticateRepository = new AuthRepository();
const authenticateService = new AuthenticateService();
declare global {
  namespace Express {
    interface Request {
      customerId?: number;
      userId?: number;
      roleId?: string;
      userName?: string | null;
    }
  }
}

export const loginInputValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Validation failed',
      errors: result.error.issues,
    });
  }
  next();
};
export const forgetPasswordInputValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = forgetPasswordSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      Message: 'Validation failed',
      errors: result.error.issues,
    });
  }
  next();
};
export const resetPasswordInputValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = resetPasswordSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      Message: 'Validation failed',
      errors: result.error.issues,
    });
  }
  next();
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token = req.headers.authorization || req.headers.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: errorMessage.NOT_AUTHORIZED.message });
  }
  token = token.split(' ')[1];

  const decodedToken = verifyToken(token, process.env.ACCESS_TOKEN_SECRET!);

  if (!decodedToken)
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: errorMessage.EXPIRED_INVALID_TOKEN.message });
  /*
  when client side receive that response he should send request for refresh token api
   */
  // send to related customer api endpoints
  if (decodedToken.customerId) {
    req.customerId = decodedToken.customerId.id;
  } else {
    // send to related dashboard user api endpoints
    req.roleId = decodedToken.roleId.id;
  }
  next();
};
