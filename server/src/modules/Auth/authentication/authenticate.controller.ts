import { Request, Response } from 'express';
import { AuthenticateService } from './authenticate.service';
import { loginDTO } from './authenticate.dto';
import * as UAParser from 'ua-parser-js';
import { StatusCodes } from 'http-status-codes';
import { NOT_FOUND } from '../../../error/error.exeception';
import { errorMessage } from '../../../error/error.message';
const authenticateService = new AuthenticateService();
export class AuthenticateController {
  async login(req: Request, res: Response) {
    const parser = new UAParser.UAParser(req.headers['user-agent']);
    const result = parser.getResult();
    const device = result.device.type ?? 'desktop';
    const { email, password } = req.body;
    try {
      const { accessToken, refreshToken } = await authenticateService.login({
        email,
        password,
        device,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      res.status(StatusCodes.OK).json({ message: accessToken });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new NOT_FOUND(errorMessage.TOKEN_NOT_FOUND.message);
    }

    try {
      const { accessToken } = await authenticateService.refresh(refreshToken);
      res.status(StatusCodes.OK).json({ message: accessToken });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }
  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new NOT_FOUND(errorMessage.TOKEN_NOT_FOUND.message);
    }

    try {
      await authenticateService.logout(refreshToken);
      res.status(StatusCodes.OK).json({ message: 'Logout successfully' });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

  async forgetPassword(req: Request, res: Response) {
    const { email } = req.body;
    try {
      await authenticateService.forgetPassword(email);
      res.status(StatusCodes.OK).json({ message: 'Email sent successfully' });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }
  async resetPassword(req: Request, res: Response) {
    const { password } = req.body;
    const token = req.query.token;

    try {
      await authenticateService.resetPassword(token as string, password);
      res
        .status(StatusCodes.OK)
        .json({ message: 'Password reset successfully' });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }
}
