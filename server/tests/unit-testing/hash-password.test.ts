import { HashPassword } from '../../src/modules/Auth/helpers/hashPassword';
describe('HashPassword', () => {
  describe('hasPassword', () => {
    it('should hash password', async () => {
      const password = 'pass123';
      const result = await HashPassword.hashPassword(password);
      expect(result).toBeDefined();
      expect(result).not.toEqual(password);
      expect(typeof result).toBe('string');
    });
  });
  describe('comparePassword', () => {
    it('should return true when compare password', async () => {
      const password = 'pass123';
      const hash = await HashPassword.hashPassword(password);
      const result = await HashPassword.comparePassword(password, hash);
      expect(result).toBe(true);
    });
    it('should return false when password not match', async () => {
      const password = 'pass123';
      const hash = await HashPassword.hashPassword(password);
      const result = await HashPassword.comparePassword("WrongPassword", hash);
      expect(result).toBe(false);
    });
  });
});
