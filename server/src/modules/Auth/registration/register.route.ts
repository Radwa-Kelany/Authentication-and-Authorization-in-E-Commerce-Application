import express from 'express';
import { RegisterController } from './register.controller';
import {
  customerInputValidator,
  customerTypeMiddleware,
  sellerTypeMiddleware,
  sellerInputValidator,
  sendOTPInputValidator,
  verifyOTPInputValidator
} from './register.middleware';

const router = express.Router();
const registerController = new RegisterController();
router.post(
  '/sendOTP',
  sendOTPInputValidator,
  registerController.sendOTP,
);
router.post(
  '/verifyOTP',
  verifyOTPInputValidator,
  registerController.verifyOTP,
);

router.post(
  '/seller',
  sellerInputValidator,
  sellerTypeMiddleware,
  registerController.createSeller,
);

router.post(
  '/customer',
  customerInputValidator,
  customerTypeMiddleware,
  registerController.createCustomer,
);

export { router as registerRouter };
