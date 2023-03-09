import * as Joi from "joi";

export const productsStocksSchema = Joi.object({
  TransactItems: Joi.array()
    .items(
      Joi.object({
        Put: Joi.object({
          TableName: Joi.string().required(),
          Item: Joi.object({
            id: Joi.object({
              S: Joi.string().required(),
            }).required(),
            title: Joi.object({
              S: Joi.string().required(),
            }).required(),
            description: Joi.object({
              S: Joi.string().required(),
            }).required(),
            price: Joi.object({
              N: Joi.string().required(),
            }).required(),
          }).required(),
        }).required(),
      }),
      Joi.object({
        Put: Joi.object({
          TableName: Joi.string().required(),
          Item: Joi.object({
            id: Joi.object({
              S: Joi.string().required(),
            }).required(),
            product_id: Joi.object({
              S: Joi.string().required(),
            }).required(),
            count: Joi.object({
              N: Joi.string().required(),
            }).required(),
          }).required(),
        }).required(),
      })
    )
    .required(),
});
