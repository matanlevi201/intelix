import z from "zod";

export const Enable2FASchema = z.object({
  token: z.string(),
});

export const Verify2FASchema = z.object({
  token: z.string(),
});

export const Disable2FASchema = z.object({
  token: z.string(),
});
