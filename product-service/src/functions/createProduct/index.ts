import { serverlessSchema } from './schema';
import { handlerPath } from '@libs/handlerResolver';
import { AWS } from '@serverless/typescript';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        request: {
          schemas: {
            'application/json': serverlessSchema
          }
        },
        cors: true
      }
    }
  ]
} as NonNullable<AWS["functions"]>[string]
