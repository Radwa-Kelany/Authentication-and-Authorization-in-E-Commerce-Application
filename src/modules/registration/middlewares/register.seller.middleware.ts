import { Request, Response, NextFunction } from 'express';
import { RegisterService } from '../register.service';
import { RoleEnum, UserTypeEnum } from '@prisma/client';
import { SellerSchema, UserSchema } from '../register.validation';
import { StatusCodes } from 'http-status-codes';

const registerService = new RegisterService();
export const sellerTypeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userType = await registerService.getUserTypeIdByName(
    UserTypeEnum.DASHBOARD_USER,
  );
  if (!userType) throw new Error('sellerTypeId is null');

  const { id: userTypeId } = userType;
  req.body.userTypeId = userTypeId;
  next();
};

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
