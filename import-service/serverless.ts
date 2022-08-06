import type { AWS } from '@serverless/typescript';

import {
  hello,
  importProductsFile,
  importFileParser
} from '@functions/index'

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      // SQS_URL: {
      //   Ref: 'SQSQueue'
      // },
      SQS_URL: 'https://sqs.ap-northeast-2.amazonaws.com/144167227237/catalogItemsQueue'
    },
    lambdaHashingVersion: '20201221',
    region: 'ap-northeast-2',
    profile: 'Administrator',
    iamRoleStatements: [
      {
        Sid: "AllowPublic",
        Effect: "Allow",
        Action: "s3:*",
        Resource: [
          "arn:aws:s3:::import-bucket-yulei",
          "arn:aws:s3:::import-bucket-yulei/*"
        ] 
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [
          {
            'Fn::GetAtt': ['SQSQueue', 'Arn']
          }
        ]
      }
    ],
    // Have no idea why this is not working
    // I can just config in AWS Console
    // s3: {
    //   bucketOne: {
    //     name: BUCKET,
    //     corsConfiguration: {
    //       CorsRules: [
    //         {
    //           AllowedMethods: ['PUT'],
    //           AllowedOrigins: ['*'],
    //           AllowedHeaders: ['*'],
    //           ExposedHeaders: [],
    //         }
    //       ]
    //     }
    //   }
    // }
  },
  // Create resource:
  // resources: {
  //   Resources: {
  //     SQSQueue: {
  //       Type: 'AWS::SQS::Queue',
  //       Properties: {
  //         QueueName: 'catalogItemsQueue'
  //       }
  //     }
  //   }
  // },
  // import the function via paths
  functions: {
    hello,
    importProductsFile,
    importFileParser
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  }
};

module.exports = serverlessConfiguration;
