import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email(),
  username: z.string().min(3),
  password: z.string().min(6),
});