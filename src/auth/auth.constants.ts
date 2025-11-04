import { Prisma } from '@prisma/client';

export const CODE_TTL_MS = 5 * 60 * 1000; // 5 minutes
export const ACCESS_TOKEN_EXPIRATION = '20h';
export const MULTI_STEP_REGISTRATION_TOKEN_EXPIRATION = '15m'; // Increased for better UX
export const REFRESH_TOKEN_EXPIRATION = '2d'; 
export const PASSWORD_RESET_TOKEN_EXPIRATION = '1h';
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REQUIREMENTS = [
  /[a-z]/, // lowercase
  /[A-Z]/, // uppercase
  /\d/, // digit 
];
export const PASSWORD_REQUIREMENTS_MESSAGE =
  'Password must be at least 8 characters long and include lowercase letters, uppercase letters, and numbers.';

export const safeUserSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  createdAt: true,
  updatedAt: true,
};