import { Request, Response, NextFunction } from 'express';
import { RegisterService } from './register.service';
import { UserTypeEnum, RoleEnum } from '@prisma/client';
import {
  SendOTPSchema,
  VerifyOTPSchema,
  UserSchema,
  CustomerSchema,
  SellerSchema,
} from './register.validation';

import { StatusCodes } from 'http-status-codes';
import { errorMessage } from '../../../error/error.message';
const registerService = new RegisterService();

export const sendOTPInputValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = SendOTPSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Validation failed',
      errors: result.error.issues,
    });
  }
  next();
};
export const verifyOTPInputValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = VerifyOTPSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Validation failed',
      errors: result.error.issues,
    });
  }
  next();
};

export const customerInputValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result1 = UserSchema.safeParse(req.body);
  const result2 = CustomerSchema.safeParse(req.body);
  const error = [
    ...(result1.success ? [] : result1.error.issues),
    ...(result2.success ? [] : result2.error.issues),
  ];
  if (error.length > 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Validation failed',
      errors: error,
    });
  }

  next();
};

export const customerTypeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userType = await registerService.getUserTypeIdByName(
    UserTypeEnum.CUSTOMER,
  );
  if (!userType) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: errorMessage.USER_TYPE_NOT_FOUND.message });
  }
  const { id } = userType;
  req.body.userTypeId = id;
  next();
};

// Seller Middlewares

export const sellerInputValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result1 = UserSchema.safeParse(req.body);
  const result2 = SellerSchema.safeParse(req.body);

  const errors = [
    ...(result1.success ? [] : result1.error.issues),
    ...(result2.success ? [] : result2.error.issues),
  ];

  if (errors.length > 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Validation failed',
      errors,
    });
  }

  next();
};
export const sellerTypeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userType = await registerService.getUserTypeIdByName(
    UserTypeEnum.DASHBOARD_USER,
  );
  const role = await registerService.getRoleIdByName(RoleEnum.SELLER);
  if (!userType || !role) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: `${errorMessage.USER_TYPE_NOT_FOUND.message} or ${errorMessage.ROLE_NOT_FOUND.message}` });
  }

  const { id: userTypeId } = userType;
  const { id: roleId } = role;
  req.body.userTypeId = userTypeId;
  req.body.roleId = roleId;
  next();
};
