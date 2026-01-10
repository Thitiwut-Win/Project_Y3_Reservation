import Joi from "joi";

export const createPaymentSchema = Joi.object({
  eventId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  seats: Joi.number().positive().required(),
});
