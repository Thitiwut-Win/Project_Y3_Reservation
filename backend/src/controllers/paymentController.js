import Payment from "../models/Payment.js";
// import Event from "../models/Event.js";
import qrcode from "qrcode";
import generatePayload from "promptpay-qr";

export const createPayment = async (req, res) => {
  try {
    const { eventId, amount, seats } = req.body;

    if (!eventId || !amount || !seats) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const promptpayId = process.env.PROMPTPAY_ID;

    const qrString = generatePayload(promptpayId, { amount });

    const payment = await Payment.create({
      userId: req.userId,
      eventId,
      amount,
      seats,
      qrString,
    });

    const qrImage = await qrcode.toDataURL(qrString);

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

// export const confirmPayment = async (req, res) => {
//   try {
//     const { transactionId, status, paidAt } = req.body;

//     const payment = await Payment.findById(transactionId);
//     if (!payment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     if (status === "SUCCESS") {
//       payment.status = "paid";

//       const event = await Event.findById(payment.eventId);
//       if (event) {
//         event.availableSeats -= payment.seats;
//         await event.save();
//       }

//       for (let i = 0; i < payment.seats; i++) {
//         await Ticket.create({
//           userId: payment.userId,
//           eventId: payment.eventId,
//           paymentId: payment._id,
//           status: "reserved",
//         });
//       }
//     } else if (status === "FAILED") {
//       payment.status = "failed";
//     }

//     payment.paidAt = paidAt ? new Date(paidAt) : new Date();
//     await payment.save();

//     res.json({ success: true });
//   } catch (err) {
//     console.error("Payment confirm error:", err);
//     res.status(500).json({ message: "Failed to confirm payment" });
//   }
// };
