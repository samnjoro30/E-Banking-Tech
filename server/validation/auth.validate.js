const { z } = require('zod');

const AuthRegisterValidation = z.object({
  email: z.string().min(1, 'Email is required').toLowerCase().trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(30, 'Password must be at most 30 characters long'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be at most 50 characters long')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be at most 50 characters long')
    .trim(),
  gender: z.string(),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 characters long')
    .max(15, 'Phone number must be at most 15 characters long'),
});

module.exports = { AuthRegisterValidation };
