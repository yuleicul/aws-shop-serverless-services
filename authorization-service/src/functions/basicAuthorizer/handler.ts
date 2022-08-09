import { middyfy } from '@libs/lambda';
import { APIGatewayAuthorizerHandler } from 'aws-lambda';

const defaultDenyAllPolicy = {
  "principalId": "user",
  "policyDocument": {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Action": "execute-api:Invoke",
              "Effect": "Deny",
              "Resource": "*"
          }
      ]
  }
};

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
    const encodedCredentials = token.split(' ')[1]
    const buff = Buffer.from(encodedCredentials, 'base64')
    const plainCredentials = buff.toString('utf-8').split(':')
    const username = plainCredentials[0]
    const password = plainCredentials[1]
  
    console.log(`username: ${username}, password: ${password}`)
  
    const storedUserPassword = process.env[username]
  
    const effect = !storedUserPassword || storedUserPassword != password ? 'Deny' : 'Allow'
  
    return [encodedCredentials, effect]
  } catch (error) {
    throw error
  }
}

export const basicAuthorizer: APIGatewayAuthorizerHandler = async (event, _context) => {
  try {
    console.log('=== EVENT ===', event);
  
    if (event.type !== 'TOKEN') {
      return defaultDenyAllPolicy
    }
  
    const [encodedCredentials, effect] = innerHandler(event.authorizationToken) 
    const policy = generatePolicy(encodedCredentials, event.methodArn, effect)
    console.log('=== POLICY ===', policy)
    return policy

  } catch (error) {
    console.error(error)
    return defaultDenyAllPolicy
  }
}

export const main = middyfy(basicAuthorizer);
