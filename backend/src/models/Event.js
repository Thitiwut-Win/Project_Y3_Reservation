import { Schema, model } from "mongoose";

const eventSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  venue: {type: String},
  category: {type: String},
  date: { type: Date, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  price: {type: Number}
});

export default model("Event", eventSchema);
