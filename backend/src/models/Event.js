import { Schema, model } from "mongoose";

const eventSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
});

export default model("Event", eventSchema);
