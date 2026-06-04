import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import router from './routes';

const app = express();
app.use(cors());

app.use(cookieParser());

app.use(express.json());
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => res.send('Hello World!'));

export default app;
