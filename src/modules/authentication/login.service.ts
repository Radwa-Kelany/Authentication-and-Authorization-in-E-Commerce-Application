import { UserTypeEnum } from '@prisma/client';
import { HashPassword } from '../helpers/hashPassword';
import { createToken } from '../helpers/jwt';
import { RegisterService } from '../registration/register.service';
import { loginDTO } from './login.dto';
import { LoginRepository } from './login.repository';
import dotenv from 'dotenv';
dotenv.config();

const loginRepository = new LoginRepository();
const registerService = new RegisterService();

export class LoginService {
  async login(loginInput: loginDTO) {
    const existingUser = await loginRepository.getUserByEmail(loginInput.email);
    if (!existingUser) {
      throw new Error('Email or password are invalid');
    }
    // compare password with db password
    const inputPasswordHash = await HashPassword.hashPassword(
      loginInput.password,
    );
    const passwordMatch = await HashPassword.comparePassword(
      existingUser.password,
      inputPasswordHash,
    );
    if (!passwordMatch) {
      throw new Error('Email or password are invalid');
    }

    // create refresh token and access token and send to client

    // refresh token:
    // refresh token payload is user id
    const refreshToken = createToken(
      { userId: existingUser.id },
      process.env.REFRESH_TOKEN_EXPIRES_IN!,
      process.env.REFRESH_TOKEN_SECRET!,
    );
    // save in session table
    const session = await loginRepository.createUserSession({
      userId: existingUser.id,
      refreshToken,
      expiresAt: new Date(
        Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRES_IN!),
      ),
    });

    // access token:
    const userType = await registerService.getUserTypeIdByName(
      UserTypeEnum.DASHBOARD_USER,
    );
    let accessToken;
    // access token payload is [user id and role id] in case of dashboard-user
    if (existingUser.userTypeId === userType?.id) {
      accessToken = createToken(
        { userId: existingUser.id, roleId: existingUser.userTypeId },
        process.env.ACCESS_TOKEN_EXPIRES_IN!,
        process.env.ACCESS_TOKEN_SECRET!,
      );
    }
    // access token payload is user id and customer id in case of customer
    else {
      const customerId = await loginRepository.getCustomerIdByUserId(
        existingUser.id,
      );
      accessToken = createToken(
        { userId: existingUser.id, customerId },
        process.env.ACCESS_TOKEN_EXPIRES_IN!,
        process.env.ACCESS_TOKEN_SECRET!,
      );
    }

    // send refresh token and access token to client
    return { accessToken, refreshToken };
  }
}
