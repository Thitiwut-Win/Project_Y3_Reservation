import Joi from "joi";

export const createPaymentSchema = Joi.object({
  eventId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  seats: Joi.number().positive().required(),
});

export const confirmPaymentSchema = Joi.object({
  transactionId: Joi.string().required(),
  status: Joi.string().valid("SUCCESS", "FAILED", "PENDING").required(),
  paidAt: Joi.date().iso(),
});
