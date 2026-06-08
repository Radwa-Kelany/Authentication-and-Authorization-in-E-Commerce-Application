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
const authenticateRepository = new AuthRepository();
const authenticateService = new AuthenticateService();
declare global {
  namespace Express {
    interface Request {
      customerId?: number;
      userId?: number;
      roleId?: string;
      userName?: string;
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
      Message: 'Validation failed',
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
    return res.status(401).json({ error: 'Unauthorized User' });
  }
  token = token.split(' ')[1];

  const decodedToken = verifyToken(token, process.env.ACCESS_TOKEN_SECRET!);

  if (!decodedToken)
    return res.status(401).json({ error: 'Invalid or Expired Token' });
  // send to related customer api endpoints
  if (decodedToken.customerId) {
    req.customerId = decodedToken.customerId.id;
  } else {
    // send to related dashboard user api endpoints
    req.roleId = decodedToken.roleId.id;
  }
  next();
};

// To be continue ...
export const getCustomerNameMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    req.userName = 'Guest';
  } else {
    const decodedToken = verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    );
    const user = await authenticateRepository.getUserById(decodedToken.userId);
    if (!user) {
      req.userName = 'Guest';
    }
    req.userName = user?.firstName;
  }
  next();
};
