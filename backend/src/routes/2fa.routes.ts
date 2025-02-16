import { Router } from "express";
import { disable2fa, enable2fa, verify2fa, generate2faQr } from "../controllers/2fa.controllers";
import { requireOtp, requireAuth, validateRequest, setSession, socialGuard } from "../middlewares";
import { Disable2FASchema, Enable2FASchema, Verify2FASchema } from "../validations";

const router = Router();

router.get("/", requireAuth, socialGuard, generate2faQr);
router.post("/", requireAuth, socialGuard, validateRequest(Enable2FASchema), enable2fa, setSession);
router.delete("/", requireAuth, socialGuard, requireOtp, validateRequest(Disable2FASchema), disable2fa, setSession);
router.post("/verify", requireAuth, validateRequest(Verify2FASchema), verify2fa, setSession);

export { router as twoFactorRouter };
