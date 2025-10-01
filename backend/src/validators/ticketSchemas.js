import Joi from "joi";

export const reserveTicketSchema = Joi.object({
  seats: Joi.number().integer().min(1).required()
});
