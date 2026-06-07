import { Request, Response } from 'express';
import { RegisterService } from './register.service';
import { CustomerDTO, SellerDTO } from './register.dto';
const registerService = new RegisterService();
// This controller implements ui registration process for both customer and seller
export class RegisterController {
  async createCustomer(req: Request, res: Response) {
    const user: CustomerDTO = req.body;

    try {
      const createdUser = await registerService.createCustomer(user);
      res.status(201).json({
        message: `Customer account with email ${createdUser.email} created successfully`,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  async createSeller(req: Request, res: Response) {
    const user: SellerDTO = req.body;
    try {
      const createdUser = await registerService.createSeller(user);
      res.status(201).json({
        message: `Customer account with email ${createdUser.email} created successfully`,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
