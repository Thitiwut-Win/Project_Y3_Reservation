import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  status: { type: String, enum: ["reserved", "cancelled"], default: "reserved" },
  createdAt: { type: Date, default: Date.now },
});

export default model("Ticket", ticketSchema);
