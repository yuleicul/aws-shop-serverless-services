import { middyfy } from '@libs/lambda';
import { APIGatewayAuthorizerHandler } from 'aws-lambda';

const generatePolicy = (principalId, resource, effect = 'Allow') => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}

const innerHandler = (token: string) => {
  try {
    const encodedCreds = token.split(' ')[1]
    const buff = Buffer.from(encodedCreds, 'base64')
    const plainCreds = buff.toString('utf-8').split(':')
    const username = plainCreds[0]
    const password = plainCreds[1]
  
    console.log(`username: ${username}, password: ${password}`)
  
    const storedUserPassword = process.env[username]
  
    // if (!storedUserPassword || (storedUserPassword !== password)) 
    // return new ForbiddenException()
    const effect = !storedUserPassword || storedUserPassword != password ? 'Deny' : 'Allow'
  
    // return formatJSONResponse(`Hello, ${username}`)
    return [encodedCreds, effect]
  } catch (error) {
    throw error
  }
}

export const basicAuthorizer: APIGatewayAuthorizerHandler = (event, _context, callback) => {
  try {
    console.log('=== REQUEST ===', event);
  
    if (event.type !== 'TOKEN') {
      // return new UnauthorizedException()
      callback('Unauthorized')
    }
  
    // @ts-ignore
    const [encodedCreds, effect] = innerHandler(event.authorizationToken) 
    const policy = generatePolicy(encodedCreds, event.methodArn, effect)
    callback(null, policy)

    console.log('=== POLICY ===', policy)
  } catch (error) {
    callback(error)
  }
}

export const main = middyfy(basicAuthorizer);
