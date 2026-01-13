import { Router } from "express";
import { validateBody } from "../middleware/validate.js";
import { registerSchema, loginSchema, googleSchema } from "../validators/authSchemas.js";
import { googleSignIn, loginUser, logoutUser, registerUser } from "../controllers/authController.js";

const router = Router();

router.post("/register", validateBody(registerSchema), registerUser);

router.post("/login", validateBody(loginSchema), loginUser);

router.post("/google", validateBody(googleSchema), googleSignIn);

router.post("/logout", logoutUser)

export default router;
