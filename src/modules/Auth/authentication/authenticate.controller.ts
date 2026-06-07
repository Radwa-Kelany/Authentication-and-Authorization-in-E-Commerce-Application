import { Request, Response } from 'express';
import { AuthenticateService } from './authenticate.service';
import { loginDTO } from './authenticate.dto';
const authenticateService = new AuthenticateService();
export class AuthenticateController {
  async login(req: Request, res: Response) {
    const { email, password }: loginDTO = req.body;

    try {
      const { accessToken, refreshToken } = await authenticateService.login({
        email,
        password,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      res.status(200).json({ accessToken });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    try {
      const { accessToken } = await authenticateService.refresh(refreshToken);
      res.status(200).json(accessToken);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    try {
      await authenticateService.logout(refreshToken);
      res.status(200).json('Logout successfully');
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async forgetPassword(req: Request, res: Response) {
    const { email } = req.body;
    try {
      await authenticateService.forgetPassword(email);
      res.status(200).json('Email sent successfully');
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  async resetPassword(req: Request, res: Response) {
    const { password } = req.body;
    // const token = req.query.token;
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6OX0sImlhdCI6MTc4MDgzNTYzMSwiZXhwIjoxNzgwODM2NTMxfQ.QTpl5YNxke3i4Ao7xw-3Ipsy_bpORgybVnWojqNd4jc';
    try {
      await authenticateService.resetPassword(token as string, password);
      res.status(200).json('password reset successfully');
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
