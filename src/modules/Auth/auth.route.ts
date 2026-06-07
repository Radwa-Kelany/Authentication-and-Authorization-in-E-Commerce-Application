import express from 'express';
import { registerRouter } from './registration/register.route';
import { authenticateRouter } from './authentication/authenticate.route';

const router = express.Router();

router.use('/register', registerRouter);
router.use('/', authenticateRouter);

export {router as authRouter };
