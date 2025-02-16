import { Router } from "express";
import { googleCallback, googleRedirect, refreshToken, signin, signout, signup } from "../controllers/auth.controllers";
import { validateRequest, setSession, blacklistGuard } from "../middlewares";
import { SigninSchema, SignupSchema } from "../validations";
import Google from "passport-google-oauth20";
import passport from "passport";
import { env } from "../config";

const router = Router();

router.post("/users", validateRequest(SignupSchema), signup, setSession);
router.post("/sessions", validateRequest(SigninSchema), signin, setSession);
router.get("/sessions", blacklistGuard, refreshToken);
router.delete("/sessions", signout);

router.get("/oauth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/oauth/google/cb", passport.authenticate("google", { session: false }), googleRedirect);

export const GoogleStrategy = new Google.Strategy(
  {
    clientID: env.GCP_CLIENT_ID,
    clientSecret: env.GCP_CLIENT_SECRET,
    callbackURL: env.GPC_CALLBACK_URL,
  },
  googleCallback
);

export { router as authRouter };
