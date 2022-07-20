import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown> | Array<unknown>, statusCode = 200) => {
  return {
    statusCode,
    body: JSON.stringify(response),
    headers: {
      // Required for CORS support to work
      'Access-Control-Allow-Origin': '*',
      // Required for cookies, authorization headers with HTTPS
      'Access-Control-Allow-Credentials': true
    }
  }
}
