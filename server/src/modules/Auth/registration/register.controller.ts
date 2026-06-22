import { Request, Response } from 'express';
import { RegisterService } from './register.service';
import { CustomerDTO, SellerDTO } from './register.dto';
import { StatusCodes } from 'http-status-codes';
const registerService = new RegisterService();
export class RegisterController {
  async sendOTP(req: Request, res: Response) {
    const email: string = req.body.email;

    try {
      const { session_token } = await registerService.sendOTP(email);
      res.status(StatusCodes.OK).json({
        message: session_token,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }
  async verifyOTP(req: Request, res: Response) {
    const { session_token, otp } = req.body;

    try {
      const { verified_token, email } = await registerService.verifyOTP(
        session_token,
        otp,
      );
      res.status(StatusCodes.OK).json({
        message: { verified_token, email }
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }
  async createCustomer(req: Request, res: Response) {
    const user: CustomerDTO = req.body;
    try {
      const createdUser = await registerService.createCustomer(user);
      res.status(StatusCodes.CREATED).json({
        message: `Customer account with email ${createdUser.email} created successfully`,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }
  async createSeller(req: Request, res: Response) {
    const user: SellerDTO = req.body;
    try {
      const createdUser = await registerService.createSeller(user);
      res.status(StatusCodes.CREATED).json({
        message: `Seller account with email ${createdUser.email} created successfully`,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }
}
