import express from 'express';
import { registerRouter } from '../modules/registration/register.route';
import { authRouter } from '../modules/auth.route';

const router = express.Router();

router.use('/auth', authRouter);

export default router;
