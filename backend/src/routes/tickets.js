import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { reserveTicketSchema } from "../validators/ticketSchemas.js";
import { cancelTicket, getMyTickets, reserveTickets } from "../controllers/ticketController.js";

const router = Router();

// Reserve a ticket
router.post("/reserve/:eventId", authMiddleware, validateBody(reserveTicketSchema), reserveTickets);

// Cancel ticket
router.delete("/:ticketId", authMiddleware, cancelTicket);

// Get user's tickets
router.get("/me", authMiddleware, getMyTickets);

export default router;
