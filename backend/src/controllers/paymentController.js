import Payment from "../models/Payment.js";
// import Event from "../models/Event.js";
import qrcode from "qrcode";
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";
import {customAlphabet} from "nanoid"

async function fetchAccessToken (uuid) {
  const response = await fetch("https://api-sandbox.partners.scb/partners/sandbox/v1/oauth/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"requestUId": uuid,
			"resourceOwnerId": process.env.SCB_API_KEY,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
		},
		body: JSON.stringify({
			applicationKey: process.env.SCB_API_KEY,
			applicationSecret: process.env.SCB_API_SECRET
		}),
	})
  const data = await response.json();
  return data;
}

async function fetchQR (token, userId, eventId, amount, uuid) {

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random1 = Math.random().toString(36).substring(2, 8).toUpperCase();
  const generateRef3 = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 15);
  const random2 = generateRef3();
  
  const ref1 = `TXN${date}${random1}`;
  const ref2 = crypto.createHash("sha256").update(`${userId}:${eventId}:${process.env.HASH_SECRET}`).digest("hex").slice(0, 20).toUpperCase();
  const ref3 = `${process.env.REF_PREFIX}${random2}`;

  const response = await fetch("https://api-sandbox.partners.scb/partners/sandbox/v1/payment/qrcode/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"resourceOwnerId": process.env.SCB_API_KEY,
			"requestUId": uuid,
			"authorization": `Bearer ${token}`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
		},
		body: JSON.stringify({
			qrType: "PP",
			amount: amount,
			ppType: "BILLERID",
			ppId: "529434008292747",
			ref1: ref1,
			ref2: ref2,
			ref3: ref3,
		})
	})
  const data = await response.json();
  return data;
}

export const createPayment = async (req, res) => {
  try {
    const { eventId, amount, seats } = req.body;
    const userId = req.userId;

    if (!eventId || !amount || !seats) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const uuid = uuidv4();
    const tokenResponse = await fetchAccessToken(uuid);
    if (!tokenResponse) return res.status(400).json({ message: "Error request access token" });
    console.log(tokenResponse)

		const token = tokenResponse.data.accessToken;
    const QRResponse = await fetchQR(token, userId, eventId, amount, uuid);
    if (!QRResponse) return res.status(400).json({ message: "Error requesting QR" });

    const payment = await Payment.create({
      userId: req.userId,
      eventId,
      amount,
      seats,
      qrString: QRResponse.data.qrRawData,
    });

    const qrImage = await qrcode.toDataURL(QRResponse.data.qrRawData);

    res.json({
      success: true,
      paymentId: payment._id,
      qrImage,
      amount,
    });
  } catch (err) {
    console.error("Payment create error:", err);
    res.status(500).json({ message: "Failed to create payment" });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { transactionId, status, paidAt } = req.body;

    const payment = await Payment.findById(transactionId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (status === "SUCCESS") {
      payment.status = "paid";

      const event = await Event.findById(payment.eventId);
      if (event) {
        event.availableSeats -= payment.seats;
        await event.save();
      }

      for (let i = 0; i < payment.seats; i++) {
        await Ticket.create({
          userId: payment.userId,
          eventId: payment.eventId,
          paymentId: payment._id,
          status: "reserved",
        });
      }
    } else if (status === "FAILED") {
      payment.status = "failed";
    }

    payment.paidAt = paidAt ? new Date(paidAt) : new Date();
    await payment.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Payment confirm error:", err);
    res.status(500).json({ message: "Failed to confirm payment" });
  }
};
