import { z } from 'zod';

export const loginValidationSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'Email is required.' }),
        password: z.string({ required_error: 'Password is required' }),
    }),
});

export const changeUserPasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({ required_error: 'Old password is required' }),
        newPassword: z.string({ required_error: 'New password is required' }),
    }),
});