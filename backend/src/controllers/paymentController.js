import Payment from "../models/Payment.js";
import qrcode from "qrcode";
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";
import {customAlphabet} from "nanoid"
import { Resend } from "resend";
import User from "../models/User.js";
import base32 from "hi-base32";

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
    console.log(req.body)
    const ref3 = req.body.billPaymentRef3;
    const payment = await Payment.findOne({ref3});
    if (!payment) {
      console.error("payment not found");
      return res.json({
        resCode: "01",
        resDesc: "payment not found",
        transactionId: req.body.transactionId,
      });
    }
    payment.status = "paid";
    await payment.save();
    console.log(payment)

    const userId = payment.userId;
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found");
      return res.json({
        resCode: "01",
        resDesc: "payment not found",
        transactionId: req.body.transactionId,
      });
    }
    console.log(user)
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "Event Reservation <noreply@thitiwut.app>",
      to: user.email,
      subject: "Ticket reservation confirmation",
      html: "<strong>it works!</strong>",
    });
    // console.log(data);
    // console.log(error);

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