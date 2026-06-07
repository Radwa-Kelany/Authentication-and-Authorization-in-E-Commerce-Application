import { Router } from 'express';
import {
  forgetPasswordInputValidator,
  loginInputValidator,
  resetPasswordInputValidator,
} from './authenticate.middleware';
import { AuthenticateController } from './authenticate.controller';
import { authMiddleware } from './authenticate.middleware';

const router = Router();

const authenticateController = new AuthenticateController();
router.post('/login', loginInputValidator, authenticateController.login);

// need to be put after auth middleware
router.post(
  '/refresh',
  authMiddleware,
  authenticateController.refresh,
);

router.post(
  '/logout',
  authMiddleware,
  authenticateController.logout,
);
router.post(
  '/forget-password',
  forgetPasswordInputValidator,
  authenticateController.forgetPassword,
);
router.post(
  '/reset-password',
  resetPasswordInputValidator,
  authenticateController.resetPassword,
);

export { router as authenticateRouter };
