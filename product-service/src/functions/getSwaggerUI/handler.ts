import { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
// @ts-ignore
import swaggerDocument from './swagger.html'

export const main: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  return {
    headers: {
      'Content-Type': 'text/html',
    },
    body: swaggerDocument,
    statusCode: 200
  }
}
