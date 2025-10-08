import Event from "../models/Event.js";

export const getAllEvents = async (req, res) => {
  const events = await Event.find().sort({ dateTime: 1 });
  res.json(events);
  // res.json([{ id: 1, name: "Test Event" }]);
}
export const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
}
export const createEvent = async (req, res) => {
  try {
    const { name, description, venue, date, totalSeats, availableSeats, price } = req.body;
    if (!name || !description || !venue || !date || !totalSeats || !price) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const ev = await Event.create({
      name,
      description,
      venue,
      date: parsedDate,
      totalSeats,
      availableSeats: availableSeats || totalSeats,
      price
    });

    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}