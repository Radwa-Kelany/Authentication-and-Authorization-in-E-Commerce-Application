import { OTP_ATTEMPTS } from '../modules/Auth/registration/OTP.service';

export const errorMessage = {
  EMAIL_EXISTS: {
    message: 'Email already Registered',
  },
  OTP_RATE_LIMIT: {
    message: 'OTP rate limit exceeded',
  },
  OTP_FAILED_GENERATE: {
    message: 'Failed to generate OTP',
  },
  OTP_EXPIRED_NOT_FOUND: {
    message: 'OTP expired or invalid, please try again',
  },
  OTP_ATTEMPTS: {
    message: 'Too many failed attempts. Please request a new OTP',
  },

  OTP_INVALID: {
    message: 'Invalid OTP',
  },
  VERIFIED_TOKEN_FAILED_GENERATE: {
    message: 'Failed to generate verified token',
  },
  VERIFIED_TOKEN_NOT_FOUND: {
    message:
      'Verification token is invalid or expired. Please start registration again.',
  },
  USER_TYPE_NOT_FOUND: {
    message: 'UserType does not exist',
  },
  ROLE_NOT_FOUND: {
    message: 'Role not found',
  },

  EMAIL_PROVIDER_NOT_ALLOWED: {
    message: 'Email provider is not allowed',
  },
  NOT_AUTHORIZED: {
    message: 'Not authorized',
  },
  FORBIDDEN: {
    message: 'Forbidden',
  },
  EXPIRED_INVALID_TOKEN: {
    message: 'Invalid or Expired Token',
  },
  TOKEN_NOT_FOUND: {
    message: 'Invalid or Expired Token',
  },
  INVALID_CREDENTIALS: {
    message: 'Email or password are invalid',
  },
  FAILED_CREATE_TOKEN: {
    message: 'Error in creating token',
  },
  EXPIRED_INVALID_SESSION: {
    message: 'Session is invalid or expired or revoked, redirect to login page',
  },
  CUSTOMER_NOT_FOUND: {
    message: 'Customer not found',
  },
  USER_NOT_FOUND: {
    message: 'User not found',
  },
  SESSION_NOT_FOUND: {
    message: 'session not found',
  },

  // ----------------------------------------------------------------------------------------------------

  BAD_REQUEST: {
    code: 'BadRequestException',
    message: 'failed to created',
  },
  CART_NOT_FOUND: {
    code: 'CartNotFoundException',
    message: 'Cart with the specified ID does not exist',
  },
  CART_ITEM_NOT_FOUND: {
    code: 'CartItemNotFoundException',
    message: 'CartItem with the specified ID does not exist',
  },
  MENU_ITEM_NOT_FOUND: {
    code: 'MenuItemNotFoundException',
    message: 'MenuItem with the specified ID does not exist',
  },
  ITEM_IDEMPOTENCY: {
    code: 'CartItemIdempotencyException',
    message: 'Item is already in the cart',
  },
  RESTAURANT_NOT_MATCH: {
    code: 'RestaurantNotMatchException',
    message:
      'Your cart already contains items from another restaurant. ' +
      'Only one restaurant is allowed per cart. ' +
      'Please clear your cart first if you want to order from a different restaurant.',
  },
  QUANTITY_EXCEED: {
    code: 'QuantityExceedException',
    message: 'Requested exceeds available stock',
  },
  PRICE_NOT_MATCH: {
    code: 'PriceNotMatchException',
    message: 'price has changed, please confirm if proceed or remove the item',
  },
  EMAIL_ALREADY_REGISTERED: {
    code: 'EmailAlreadyRegisteredException',
    message: 'Email already registered',
  },
  PHONE_ALREADY_REGISTERED: {
    code: 'PhoneAlreadyRegisteredException',
    message: 'Phone already registered',
  },

  INVALID_TOKEN: {
    code: 'InvalidTokenException',
    message: 'Invalid or expired token',
  },

  PASSWORD_MISMATCH: {
    code: 'PasswordMismatchException',
    message: 'Passwords do not match',
  },
  USER_EMAIL_TAKEN: {
    code: 'UserEmailTakenException',
    message: 'Email already registered',
  },
};
