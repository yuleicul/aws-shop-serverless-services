import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { NotFoundException } from "src/classes/NotFoundException";
import { client } from '@libs/db'
import { Exception } from "src/classes/Exception";

export const findProductById = async (productId: string) => {
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

const getProductsById: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  const productId = event.pathParameters?.productId!

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

export const main = middyfy(getProductsById)
