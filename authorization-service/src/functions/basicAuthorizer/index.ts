import { handlerPath } from '@libs/handlerResolver';
import { AWS } from '@serverless/typescript';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: []
} as NonNullable<AWS["functions"]>[string]
