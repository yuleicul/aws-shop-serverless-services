import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { ForbiddenException } from '@libs/exception/ForbiddenException';
import { UnauthorizedException } from '@libs/exception/UnauthorizedException';
import { middyfy } from '@libs/lambda';

const innerHandler = async (token: string) => {
  const encodedCreds = token.split(' ')[1]
  const buff = Buffer.from(encodedCreds, 'base64')
  const plainCreds = buff.toString('utf-8').split(':')
  const username = plainCreds[0]
  const password = plainCreds[1]

  console.log(`username: ${username}, password: ${password}`)

  const storedUserPassword = process.env[username]

  if (!storedUserPassword || (storedUserPassword !== password)) return new ForbiddenException()

  return formatJSONResponse(`Hello, ${username}`)
}

export const basicAuthorizer: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  console.log('=== REQUEST ===', event);

  // if (event['type'] !== 'TOKEN') {
  if (!event.headers.Authorization) {
    return new UnauthorizedException()
  }

  const response = await innerHandler(event.headers.Authorization) 
  console.log('=== RESPONSE ===', response)
  return response
}

export const main = middyfy(basicAuthorizer);
