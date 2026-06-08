import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { authRouter } from './modules/Auth/auth.route';
import {
  getCustomerNameMiddleWare,
  authMiddleware,
} from './modules/Auth/authentication/authenticate.middleware';
import router from './routes';

const app = express();
app.use(cors());

app.use(cookieParser());

app.use(express.json());

// public endpoints
app.use('/api/v1/auth', authRouter);

// That middleware is called before all public routes, so the client can display customer name or guest in home page
app.use(getCustomerNameMiddleWare);

// auth middleware for protected routes 
app.use(authMiddleware);
// protected endpoints
app.use('/api/v1', router);

export default app;
