import jwt from 'jsonwebtoken';

export const createToken = (
  payload: any,
  secret: string,
  options: jwt.SignOptions,
) => {
  const token = jwt.sign(payload, secret, options);
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
