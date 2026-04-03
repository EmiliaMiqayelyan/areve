import { Router } from "express";
import { loginAdmin } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validate";
import { loginSchema } from "../validators/schemas";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/admin/auth/login", validateBody(loginSchema), asyncHandler(loginAdmin));

export default router;
