import { Request, Response } from 'express';
import { LoginService } from './login.service';
import { loginDTO } from './login.dto';
const loginService = new LoginService();
export class LoginController {
  async login(req: Request, res: Response) {
    const { email, password }: loginDTO = req.body;

    try {
      const { accessToken, refreshToken } = await loginService.login({
        email,
        password,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      res.status(200).json(accessToken);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
