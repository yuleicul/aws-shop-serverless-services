import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { client } from '@libs/db';
import { middyfy } from '@libs/lambda';
import { BadRequestException } from 'src/classes/BadRequestException';
import { Exception } from 'src/classes/Exception';

import schema from './schema';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { title, description = '', price, count } = event.body

  if (!(title && price && count)) return new BadRequestException()

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

    return formatJSONResponse({
      id,
      title,
      description,
      price,
      count
    });

  } catch (error) {
    await client.query(`ROLLBACK`)
    console.error(error)
    return new Exception()
  } finally {
    client.end()
  }
}

export const main = middyfy(createProduct);
