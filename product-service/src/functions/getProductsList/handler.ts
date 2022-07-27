import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { dbOptions } from '@libs/db'
import { Exception } from "src/classes/Exception";
import { Client } from "pg";

const innerHandler = async () => {
  const client = new Client(dbOptions)

  try {
    await client.connect()
    const result = await client.query(`
      SELECT id, title, description, price, count FROM product
      LEFT JOIN stock ON product.id = stock.product_id
    `)
    return formatJSONResponse(result.rows)
  } catch (error) {
    console.error(error)
    return new Exception()
  } finally {
    await client.end()
  }
}

const getProductsList: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  const response = await innerHandler() 
  console.log('=== RESPONSE ===', response)
  return response
}

export const main = middyfy(getProductsList)