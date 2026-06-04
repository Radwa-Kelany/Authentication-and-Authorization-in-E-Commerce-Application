import express from 'express';
import { registerRouter } from '../registration/register.route';

const router = express.Router();

router.use('/auth', registerRouter);

export default router;
