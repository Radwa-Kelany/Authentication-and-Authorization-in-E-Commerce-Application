import jwt from 'jsonwebtoken';

export const createToken = (
  payload: any,
  expiresIn: string,
  secret: string,
) => {
  const token = jwt.sign({ data: payload }, secret, {
    expiresIn,
  } as jwt.SignOptions);
  return token;
};

export const verifyToken = (token: string, secret: string): any => {
  try {
    const decoded = jwt.verify(token, secret) as any;

    return decoded.data;
  } catch {
    return undefined;
  }
};
