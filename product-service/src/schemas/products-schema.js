import * as Joi from "joi";

export const productsSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number(),
});
