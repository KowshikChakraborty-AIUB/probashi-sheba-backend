import { z } from 'zod';

export const userValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
        phone: z.string().min(1, 'Phone number is required'),
        role: z.enum(['user', 'admin']).default('user'),
        address: z.string().min(1, 'Address is required'),
        profileImg: z.string().url('Invalid URL').optional(),
        verified: z.boolean().default(false),
    }),
});

export const updateUserValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required').nullish(),
        phone: z.string().min(1, 'Phone number is required').nullish(),
        address: z.string().min(1, 'Address is required').nullish(),
        profileImg: z.string().url('Invalid URL').optional(),
    }),
});