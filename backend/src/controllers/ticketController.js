import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";

export const reserveTickets = async (req, res) => {
  const userId = req.userId;
  const { eventId } = req.params;
  const seatsRequested = Number(req.body.seats);

  if (seatsRequested < 1) {
    return res.status(400).json({ message: "Invalid seats requested" });
  }

  try {
    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const ev = await Event.findOneAndUpdate(
      { _id: eventId, availableSeats: { $gte: seatsRequested } },
      { $inc: { availableSeats: -seatsRequested } },
      { new: true }
    );

    if (!ev) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const tickets = [];
    for (let i = 0; i < seatsRequested; i++) {
      const t = await Ticket.create({
        user: userId,
        event: eventId,
        status: "reserved",
      });
      tickets.push(t);
    }

    res.json({ success: true, event: ev, tickets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
export const cancelTicket = async (req, res) => {
  try {
    const userId = req.userId;
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (ticket.user.toString() !== userId)
      return res.status(403).json({ message: "Not allowed" });
    if (ticket.status === "cancelled")
      return res.status(400).json({ message: "Already cancelled" });

    // Update ticket
    ticket.status = "cancelled";
    await ticket.save();

    // Update event (with new:true so we see the updated doc)
    const updatedEvent = await Event.findByIdAndUpdate(
      ticket.event,
      { $inc: { availableSeats: 1 } },
      { new: true }
    );

    res.json({
      success: true,
      ticket,
      updatedEvent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
export const getMyTickets = async (req, res) => {
  try {
    const userId = req.userId;
    const tickets = await Ticket.find({ user: userId }).populate("event");

    res.json({ amount: tickets.length, tickets });
  } catch (err) {
    console.error("Error fetching user tickets:", err);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
}