import Joi from "joi";

export type Product = {
  title: string,
  description?: string,
  price: number,
  count: number
}

export const joiSchema = Joi.object<Product>({
  title: Joi.string().required(),
  // Note that the empty string is not allowed by default and must be enabled with allow('').
  // See: https://joi.dev/api/?v=17.6.0#string
  description: Joi.string().allow(''),
  price: Joi.number().required(),
  count: Joi.number().required()
})

export const serverlessSchema = {
  type: "object",
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    count: { type: 'number' }
  },
  required: ['title', 'price', 'count']
} as const;