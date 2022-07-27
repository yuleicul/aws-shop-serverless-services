import { BUCKET, IMPORT_DIR } from '@libs/constant';
import { handlerPath } from '@libs/handlerResolver';
import { AWS } from '@serverless/typescript';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET,
        event: 's3:ObjectCreated:*',
        rules: [
          { prefix: `${IMPORT_DIR}/` }
        ],
        existing: true
      }
    }
  ]
} as NonNullable<AWS["functions"]>[string]
// function type: https://stackoverflow.com/questions/71278233/how-to-pick-or-access-indexer-index-signature-property-in-a-existing-type-in-typ
