import express from 'express';
import { RegisterController } from './register.controller';
import {
  customerInputValidator,
  customerTypeMiddleware,
} from './middlewares/register.customer.middleware';
import {
  sellerTypeMiddleware,
  sellerInputValidator,
} from './middlewares/register.seller.middleware';

const router = express.Router();
const registerController = new RegisterController();

router.post(
  '/seller',
  sellerTypeMiddleware,
  sellerInputValidator,
  registerController.createSeller,
);
router.post(
  '/customer',
  customerTypeMiddleware,
  customerInputValidator,
  registerController.createCustomer,
);

export { router as registerRouter };
