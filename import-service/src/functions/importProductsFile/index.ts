import { handlerPath } from '@libs/handlerResolver';
import { AWS } from '@serverless/typescript';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        cors: true
      }
    }
  ]
} as NonNullable<AWS["functions"]>[string]
// function type: https://stackoverflow.com/questions/71278233/how-to-pick-or-access-indexer-index-signature-property-in-a-existing-type-in-typ
