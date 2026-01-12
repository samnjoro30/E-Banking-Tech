const { z } = require('zod');

const AuthValidation = z.object({
  email: z.string().min(1, 'Email is required').toLowerCase().trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(30, 'Password must be at most 30 characters long'),
});

module.exports = { AuthValidation };
