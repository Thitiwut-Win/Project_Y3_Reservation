import Joi from "joi";

export const createEventSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
  venue: Joi.string().required(),
  category: Joi.string().valid("music", "workshop", "sport", "conference").required(),
  date: Joi.date().iso().required(),
  totalSeats: Joi.number().integer().min(1).required(),
  availableSeats: Joi.number().integer().min(1).required(),
  price: Joi.number().integer().min(1).required()
});
