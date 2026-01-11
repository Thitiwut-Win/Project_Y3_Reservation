import { Router } from "express";
import { validateBody } from "../middleware/validate.js";
import { registerSchema, loginSchema, googleSchema } from "../validators/authSchemas.js";
import { googleSignIn, loginUser, registerUser } from "../controllers/authController.js";

const router = Router();

router.post("/register", validateBody(registerSchema), registerUser);

router.post("/login", validateBody(loginSchema), loginUser);

router.post("/google", validateBody(googleSchema), googleSignIn);

export default router;
