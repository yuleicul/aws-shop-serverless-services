import { handlerPath } from '@libs/handlerResolver';
import { AWS } from '@serverless/typescript';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: {
          "Fn::GetAtt": [
            'SQSQueue',
            'Arn'
          ]
        }
      }
    }
  ]
} as NonNullable<AWS["functions"]>[string]
