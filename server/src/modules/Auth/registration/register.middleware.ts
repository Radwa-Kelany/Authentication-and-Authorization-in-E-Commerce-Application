import { Request, Response, NextFunction } from 'express';
import { RegisterService } from './register.service';
import { UserTypeEnum, RoleEnum } from '@prisma/client';
import {
  UserSchema,
  CustomerSchema,
  SellerSchema,
} from './register.validation';

import { StatusCodes } from 'http-status-codes';
const registerService = new RegisterService();

export const customerInputValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result1 = UserSchema.safeParse(req.body);
  const result2 = CustomerSchema.safeParse(req.body);

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

export const customerTypeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userType = await registerService.getUserTypeIdByName(
    UserTypeEnum.CUSTOMER,
  );
  if (!userType) throw new Error('customerTypeId is null');
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
  if (!userType) throw new Error('sellerTypeId is null');
  const role = await registerService.getRoleIdByName(RoleEnum.SELLER);
  if (!role) throw new Error('sellerRoleId is null');

  const { id: userTypeId } = userType;
  const { id: roleId } = role;
  req.body.userTypeId = userTypeId;
  req.body.roleId = roleId;
  next();
};
