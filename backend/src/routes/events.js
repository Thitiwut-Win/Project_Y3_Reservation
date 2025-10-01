import { Router } from "express";
import Event from "../models/Event.js";
import { authMiddleware } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createEventSchema } from "../validators/eventSchemas.js";

const router = Router();

// Public: list events
router.get("/", async (req, res) => {
  const events = await Event.find().sort({ dateTime: 1 });
  res.json(events);
  // res.json([{ id: 1, name: "Test Event" }]);
});

// Public: get one event by ID
router.get("/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
});

// Admin: create a new event
router.post("/", authMiddleware, validateBody(createEventSchema), async (req, res) => {
  try {
    const { name, description, date, totalSeats, availableSeats } = req.body;
    if (!name || !description || !date || !totalSeats) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const ev = await Event.create({
      name,
      description,
      date: parsedDate,
      totalSeats,
      availableSeats: availableSeats || totalSeats,
    });

    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
