import express from 'express';
import { registerRouter } from '../modules/Auth/registration/register.route';
import { authRouter } from '../modules/Auth/auth.route';

const router = express.Router();



export default router;
