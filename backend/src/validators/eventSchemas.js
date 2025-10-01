import Joi from "joi";

export const createEventSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
  date: Joi.date().iso().required(),
  totalSeats: Joi.number().integer().min(1).required(),
  availableSeats: Joi.number().integer().min(0)
});
