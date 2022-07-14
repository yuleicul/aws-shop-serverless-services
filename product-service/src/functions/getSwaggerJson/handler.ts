import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

// @ts-ignore
import swaggerJson from './swagger.json'

const getSwaggerJson:ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  return formatJSONResponse(swaggerJson)
}

export const main = middyfy(getSwaggerJson)