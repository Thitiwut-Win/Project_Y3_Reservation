import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createEventSchema } from "../validators/eventSchemas.js";
import { createEvent, getAllEvents, getEventById } from "../controllers/eventController.js";

const router = Router();

// Public: get all events
router.get("/", getAllEvents);

// Public: get one event by ID
router.get("/:id", getEventById);

// Admin: create a new event
router.post("/", authMiddleware, validateBody(createEventSchema), createEvent);

export default router;
