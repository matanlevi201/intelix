import { Router } from "express";
import { changePassword, forgotPassword, resetPassword } from "../controllers/password.controllers";
import { requireOtp, requireAuth, validateRequest, socialGuard } from "../middlewares";
import { ChangePasswordSchema, ForgotPasswordSchema, ResetPasswordSchema } from "../validations";

const router = Router();

router.put("/", requireAuth, socialGuard, requireOtp, validateRequest(ChangePasswordSchema), changePassword);
router.put("/reset", validateRequest(ResetPasswordSchema), resetPassword);
router.post("/reset", validateRequest(ForgotPasswordSchema), forgotPassword);

export { router as passwordRouter };
