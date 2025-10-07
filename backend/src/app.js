import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { logger } from "./middleware/logger.js";

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import ticketRoutes from "./routes/tickets.js";

import mongoose from "mongoose";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});
