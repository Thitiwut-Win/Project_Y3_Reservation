import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import eventRoutes from "./routes/events";
import ticketRoutes from "./routes/tickets";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);

const PORT = process.env.PORT;

async function start() {
  const mongoUri = process.env.MONGO_URI || "";
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
