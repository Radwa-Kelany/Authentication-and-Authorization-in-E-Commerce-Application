import { Router } from 'express';
import { loginInputValidator } from './login.middleware';
import { LoginController } from './login.controller';

const router = Router();

const loginController = new LoginController();
router.post('/', loginInputValidator, loginController.login);

export { router as loginRouter };
