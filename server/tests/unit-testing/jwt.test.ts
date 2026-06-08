import { TokenExpiredError } from 'jsonwebtoken';
import { createToken, verifyToken } from '../../src/modules/Auth/helpers/jwt';

describe('JWT', () => {
  (describe('createToken', () => {
    it('should return token', () => {
      const payload = { userId: 1, roleId: 2 };
      const expiresIn = '1d';
      const secret = 'secret';
      const token = createToken(payload, expiresIn, secret);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  }),
    describe('verifyToken', () => {
      it('should return payload', () => {
        const payload = { userId: 1, roleId: 2 };
        const expiresIn = '1d';
        const secret = 'secret';
        const token = createToken(payload, expiresIn, secret);
        const decoded = verifyToken(token, secret);
        expect(decoded).toEqual(payload);
      });
      it('should return false when token has wrong payload', () => {
        const payload = { userId: 1, roleId: 2 };
        const wrongPayload = { name: 'test', userId: '10', roleId: '20' };
        const expiresIn = '1d';
        const secret = 'secret';
        const wrongToken = createToken(wrongPayload, expiresIn, secret);
        const decoded = verifyToken(wrongToken, secret);
        expect(decoded).not.toEqual(payload);
      });
      it('should return undefined when token is expired', async () => {
        const payload = { userId: 1, roleId: 2 };
        const expiresIn = '1s';
        const secret = 'secret';
        const token = createToken(payload, expiresIn, secret);
        await new Promise((resolve) => setTimeout(resolve, 1100));
        const decoded = verifyToken(token, secret);
        expect(decoded).toBeUndefined();
      });
    }));
});
