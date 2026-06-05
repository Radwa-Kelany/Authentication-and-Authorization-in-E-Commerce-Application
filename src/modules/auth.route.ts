import express from 'express';
import { registerRouter } from '../modules/registration/register.route';
import { loginRouter } from './authentication/login.route';

const router = express.Router();

router.use('/register', registerRouter);
router.use('/login', loginRouter);

export {router as authRouter}
