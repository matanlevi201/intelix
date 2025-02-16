import { z, ZodError } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().url(),
  CLIENT_URL: z.string().url(),
  ACCESS_JWT_KEY: z.string().min(32),
  REFRESH_JWT_KEY: z.string().min(32),
  RESET_JWT_KEY: z.string().min(32),
  TEMP_2FA_JWT_KEY: z.string().min(32),
  EMAIL_SERVICE: z.string(),
  COURIER_AUTH_TOKEN: z.string(),
  RESET_PASSWORD_TEMPLATE_ID: z.string(),
  COURIER_DOMAIN: z.string().url(),
  GCP_CLIENT_ID: z.string().min(32),
  GCP_CLIENT_SECRET: z.string().min(32),
  GPC_CALLBACK_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = (() => {
  try {
    if (process.env.NODE_ENV === "test") {
      return process.env;
    }
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Invalid environment variables:", error.format());
    }
    process.exit(1);
  }
})();
