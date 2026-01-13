import express from "express";
import dotenv from "dotenv";
import helmet from "helmet"
import hpp from "hpp"
import rateLimit from "express-rate-limit"
import cookieParser from "cookie-parser"
import cors from "cors";
import { logger } from "./middleware/logger.js";

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import ticketRoutes from "./routes/tickets.js";
import paymentRoutes from "./routes/payments.js";

import mongoose from "mongoose";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();

app.use(helmet());
app.use(hpp());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later."
  }
});
app.use(limiter);

app.use(cookieParser());

const allowedOrigins = [process.env.NEXTAUTH_URL, ];
app.use(cors({
  origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  credentials: true
}));
app.use(express.json());
app.use(logger);

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
