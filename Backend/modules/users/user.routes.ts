import { Router } from "express";
import { validateBody } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { authRateLimiter } from "../../middleware/rateLimit.middleware";
import { registerSchema, loginSchema } from "./user.schema";
import {
    registerController,
    loginController,
    getCurrentUserController,
} from "./user.controller";

const router = Router();

router.post(
    "/register",
    authRateLimiter,
    validateBody(registerSchema),
    registerController
);

router.post(
    "/login",
    authRateLimiter,
    validateBody(loginSchema),
    loginController
);

router.get("/me", requireAuth, getCurrentUserController);

export default router;
