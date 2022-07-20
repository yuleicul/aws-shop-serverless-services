import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { client } from '@libs/db'
import { Exception } from "src/classes/Exception";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  try {
    await client.connect()
    const result = await client.query(`
      SELECT id, title, description, price, count FROM product
      LEFT JOIN stock ON product.id = stock.product_id
    `)
    client.end()
    return formatJSONResponse(result.rows)
  } catch (error) {
    console.error(error)
    return new Exception()
  }
}

export const main = middyfy(getProductsList)