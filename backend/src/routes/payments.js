import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { createPaymentSchema, confirmPaymentSchema } from "../validators/paymentSchema.js";
import { confirmPayment, createPayment } from "../controllers/paymentController.js";
import { validateBody } from "../middleware/validate.js";

const router = express.Router();

// create
router.post("/create", authMiddleware, validateBody(createPaymentSchema), createPayment);

// confirm
router.post("/confirm", validateBody(confirmPaymentSchema), confirmPayment);

export default router;
