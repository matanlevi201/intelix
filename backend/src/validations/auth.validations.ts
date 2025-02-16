import { z } from "zod";

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
