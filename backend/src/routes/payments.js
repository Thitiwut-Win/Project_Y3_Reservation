import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { createPaymentSchema } from "../validators/paymentSchema.js";
import { getPaymentStatus, completePayment, confirmPayment, createPayment, getPaymentById } from "../controllers/paymentController.js";
import { validateBody } from "../middleware/validate.js";

const router = express.Router();

// create
router.post("/create", authMiddleware, validateBody(createPaymentSchema), createPayment);

// confirm
// SCB callback
router.post("/confirm", confirmPayment);

// get payment by ID
router.get("/:id", authMiddleware, getPaymentById);

// complete
router.post("/:id", authMiddleware, completePayment);

// check status
router.get("/:id/status", authMiddleware, getPaymentStatus);

export default router;
