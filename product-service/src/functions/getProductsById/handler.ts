import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { NotFoundException } from "src/classes/NotFoundException";
import { dbOptions } from '@libs/db'
import { Exception } from "src/classes/Exception";
import { BadRequestException } from "src/classes/BadRequestException";
import Joi from 'joi'
import { Client } from "pg";

export const findProductByIdInDB = async (productId: string) => {
  const client = new Client(dbOptions)

  try {
    await client.connect()
    const result = await client.query(`
      SELECT id, title, description, price, count FROM product
      LEFT JOIN stock ON product.id = stock.product_id
      WHERE id = '${productId}'
    `)
    return result.rows[0]
  } catch (error) {
    throw error
  } finally {
    await client.end()
  }
}

export const innerHandler = async (
  productId: string,
  findProductById: (id: string) => Promise<any>
) => {
  const schema = Joi.string().guid()
  const { error } = schema.validate(productId)
  if (error) return new BadRequestException(error.message)

  let product
  try {
    product = await findProductById(productId)
  } catch (error) {
    console.error(error)
    return new Exception()
  }

  if (product) return formatJSONResponse(product)
  else return new NotFoundException('Product not found')
}

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  console.log('=== REQUEST ===', event);
  
  const productId = event.pathParameters?.productId!

  const response = await innerHandler(productId, findProductByIdInDB) 
  console.log('=== RESPONSE ===', response)
  return response
}

export const main = middyfy(getProductsById)
