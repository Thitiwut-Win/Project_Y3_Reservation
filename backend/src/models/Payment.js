import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  amount: { type: Number, required: true },
  seats: { type: Number, required: true },
  qrString: { type: String, default: null},
  status: { type: String, enum: ["pending", "qr_generated", "paid", "failed", "expired"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
