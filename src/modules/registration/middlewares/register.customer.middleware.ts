import { Request, Response, NextFunction } from 'express';
import { RegisterService } from '../register.service';
import { UserTypeEnum } from '@prisma/client';
import { CustomerSchema, UserSchema } from '../register.validation';
import { StatusCodes } from 'http-status-codes';
const registerService = new RegisterService();
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
