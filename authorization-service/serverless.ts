import type { AWS } from '@serverless/typescript';

import privateEnv from './env'

import hello from '@functions/hello';
import basicAuthorizer from '@functions/basicAuthorizer'

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
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
      ...privateEnv
    },
    lambdaHashingVersion: '20201221',
    region: 'ap-northeast-2',
    profile: 'Administrator'
  },
  // import the function via paths
  functions: { 
    hello,
    basicAuthorizer 
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
  },
};

module.exports = serverlessConfiguration;
