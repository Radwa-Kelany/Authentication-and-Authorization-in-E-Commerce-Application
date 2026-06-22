import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { authRouter } from './modules/Auth/auth.route';
import {
  authMiddleware,
} from './modules/Auth/authentication/authenticate.middleware';
import router from './routes';

import redis from '../config/redis';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
  }),
);
app.get('/', (req: Request, res: Response) => res.send('Hello World!'));
app.use(cookieParser());

app.use(express.json());

// public endpoints
app.use('/api/v1/auth', authRouter);


// auth middleware for Auth routes
app.use(authMiddleware);

// protected endpoints

app.get('/test', (req: Request, res: Response) =>
  res.json({ message: 'test' }),
);
app.use('/api/v1', router);

export default app;
