import type { AWS } from '@serverless/typescript';

import { getProductsList, getProductsById, swagger, swaggerJson } from '@functions/index'

const serverlessConfiguration: AWS = {
  service: 'product-service',
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
    },
    lambdaHashingVersion: '20201221',
    region: 'ap-northeast-2',
    profile: 'Administrator'
  },
  // import the function via paths
  functions: { 
    getProductsList,
    getProductsById,
    swagger,
    swaggerJson
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      // Solve that can not resolve pg-native
      // See: https://github.com/serverless-heaven/serverless-webpack/issues/78#issuecomment-1189894220
      exclude: ['aws-sdk', 'pg-native'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      loader: {
        '.html': 'text'
      }
    },
  }
};

module.exports = serverlessConfiguration;
