import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const googleSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required()
});