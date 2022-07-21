import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { client } from '@libs/db';
import { middyfy } from '@libs/lambda';
import { BadRequestException } from 'src/classes/BadRequestException';
import { Exception } from 'src/classes/Exception';

import { Product, joiSchema } from './schema';

const createInDB = async (product: Product) => {
  const { title, description, price, count } = product

  try {
    await client.connect()

    await client.query(`BEGIN`)

    const result = await client.query(`
      INSERT INTO product (title, description, price)
      VALUES('${title}', '${description}', ${price})
      RETURNING id;
    `)

    const id = result.rows[0].id
    await client.query(`
        INSERT INTO stock(product_id, count)
        VALUES('${id}', ${count});
    `)

    await client.query(`COMMIT`)

    return {
      id,
      title,
      description,
      price,
      count
    }

  } catch (error) {
    await client.query(`ROLLBACK`)
    throw error
  } finally {
    client.end()
  }
}

export const innerHandler = async (body: any, createInDB: (product: Product) => Promise<Product>) => {
  const { value, error } = joiSchema.validate(body)

  if (error) return new BadRequestException(error.message)

  try {
    const product = await createInDB(value)
    return formatJSONResponse(product, 201);
  } catch (error) {
    console.error(error)
    return new Exception()
  }
}

export const createProduct: ValidatedEventAPIGatewayProxyEvent<unknown> = (event) => {
  const body = event.body

  return innerHandler(body, createInDB)
}

export const main = middyfy(createProduct);
