import { z } from 'zod';

export const UserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),

  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),

  email: z.string().trim().email('Invalid email address'),

  phone: z
    .string()
    .trim()
    .min(8, 'Phone number is too short')
    .max(20, 'Phone number is too long'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters'),

  userTypeId: z.coerce
    .number()
    .int('User type ID must be an integer')
    .positive('User type ID must be greater than 0'),
});

export const SellerSchema = z.object({
  storeName: z
    .string()
    .trim()
    .min(3, 'Store name must be at least 3 characters')
    .max(100, 'Store name must not exceed 100 characters'),

  storeSlug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9-]+$/,
      'Store slug may contain only lowercase letters, numbers, and hyphens',
    )
    .min(3, 'Store slug must be at least 3 characters')
    .max(100, 'Store slug must not exceed 100 characters'),

  businessName: z
    .string()
    .trim()
    .min(2, 'Business name must be at least 2 characters')
    .max(150, 'Business name must not exceed 150 characters')
    .optional(),

  businessNumber: z
    .string()
    .trim()
    .min(5, 'Business number is invalid')
    .max(50, 'Business number is too long')
    .optional(),

  taxNumber: z
    .string()
    .trim()
    .min(5, 'Tax number is invalid')
    .max(50, 'Tax number is too long')
    .optional(),
});

export const CustomerSchema = z.object({
  dob: z.coerce.date().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
});
