import Payment from "../models/Payment.js";
import qrcode from "qrcode";
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";
import {customAlphabet} from "nanoid"
import { Resend } from "resend";
import User from "../models/User.js";
import mongoose from "mongoose";

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
  return {data, ref3};
}

export const createPayment = async (req, res) => {
  try {
    const { eventId, amount, seats } = req.body;
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    if (!eventId || !amount || !seats) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const uuid = uuidv4();
    const tokenResponse = await fetchAccessToken(uuid);
    if (!tokenResponse) return res.status(400).json({ message: "Error request access token" });

		const token = tokenResponse.data.accessToken;
    const {data: QRResponse, ref3} = await fetchQR(token, userId, eventId, amount, uuid);
    if (!QRResponse) return res.status(400).json({ message: "Error requesting QR" });

    console.log(QRResponse)
    const payment = await Payment.create({
      userId: req.userId,
      eventId,
      amount,
      seats,
      qrString: QRResponse.data.qrRawData,
      status: "pending",
      ref3: ref3
    });

    res.json({
      success: true,
      paymentId: payment._id,
    });
  } catch (err) {
    console.error("Payment create error:", err);
    res.status(500).json({ message: "Failed to create payment" });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    // console.log(req.body)
    const ref3 = req.body.billPaymentRef3;
    const payment = await Payment.findOne({ref3});
    if (!payment) {
      console.error("Payment not found");
      return res.json({
        resCode: "01",
        resDesc: "payment not found",
        transactionId: req.body.transactionId,
      });
    }
    payment.status = "paid";
    await payment.save();
    // console.log(payment)

    res.json({ 
      "resCode": "00",
      "resDesc ": "success",
      "transactionId": req.body.transactionId
    });
  } catch (err) {
    console.error("Payment confirm error:", err);
    res.status(500).json({ message: "Failed to confirm payment" });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const paymentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ message: "Invalid payment id" });
    }
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    const qrImage = await qrcode.toDataURL(payment.qrString);
    payment.qrString = qrImage;
    res.json(payment);
  } catch (err) {
    console.error("Get payment:", err);
    res.status(500).json({ message: "Failed to get payment" });
  }
}

export const completePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ message: "Invalid payment id" });
    }
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    payment.status = "paid";
    await payment.save();
    res.json({
      success: true,
      paymentId: payment._id,
    });
  } catch (err) {
    console.error("Payment complete error:", err);
    res.status(500).json({ message: "Failed to complete payment" });
  }
}

export const getPaymentStatus = async (req, res) => {
  try {
    const paymentId = req.body;
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ message: "Invalid payment id" });
    }
    const payment = await Payment.findById(paymentId);
    if (payment.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (payment.status == "paid") {
      const user = await User.findById(req.userId);
      if (!user) {
        console.error("User not found");
        res.status(404).json({ message: "User not found" });
      }
      const eventId = payment.eventId;
      const event = await Event.findById(eventId);
      if (!event) {
        console.error("Event not found");
        res.status(404).json({ message: "Event not found" });
      }
      emailConfirmation(payment, user, event);
    }
    res.json({
        paymentStatus: payment.status
      });
  } catch (err) {
    console.error("Check payment status error:", err);
    res.status(500).json({ message: "Failed to check payment status" });
  }
}

const emailConfirmation = async (payment, user, event) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: `Event Reservation <noreply@${process.env.RESEND_DOMAIN}>`,
      to: user.email,
      subject: "Ticket reservation confirmation 🎟️",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f9fafb;
          padding: 32px;
        ">
          <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; 
          padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          ">
            <h2 style=" margin-top: 0; color: #111827; font-size: 20px; ">
              🎉 Payment Confirmed
            </h2>

            <p style="color: #374151; line-height: 1.6;">
              Hi <strong>${user.name || "there"}</strong>,
            </p>

            <p style="color: #374151; line-height: 1.6;">
              Your payment has been successfully confirmed.
              Your ticket for ${event.name} at ${event.venue} ${event.date} is now reserved.
            </p>

            <div style=" margin: 24px 0; padding: 16px; background: #f3f4f6; border-radius: 8px; 
            color: #111827;
            ">
              <strong>Reference:</strong> ${payment.ref3}
            </div>

            <p style="color: #374151; line-height: 1.6;">
              You can view your ticket anytime from your account.
            </p>

            <a href="${process.env.FRONTEND_URL}/tickets" style=" display: inline-block; margin-top: 16px;
                padding: 12px 18px; background: #2563eb; color: #ffffff; text-decoration: none;
                border-radius: 8px; font-weight: 500;
            ">
              View My Ticket
            </a>

            <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;" />

            <p style="font-size: 12px; color: #6b7280;">
              If you didn’t make this payment, please contact our support team.
            </p>
          </div>
        </div>
      `,

    });
    // console.log(data);
    // console.log(error);
  } catch (err) {
    console.error(err);
  }
}