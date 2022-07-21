import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { NotFoundException } from "src/classes/NotFoundException";
import { client } from '@libs/db'
import { Exception } from "src/classes/Exception";
import { BadRequestException } from "src/classes/BadRequestException";
import Joi from 'joi'

export const findProductByIdInDB = async (productId: string) => {
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
    client.end()
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
  const productId = event.pathParameters?.productId!

  return innerHandler(productId, findProductByIdInDB)
}

export const main = middyfy(getProductsById)
