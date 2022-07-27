import { S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { BUCKET, IMPORT_DIR } from '@libs/constant';

const innerHandler = async (filename?: string) => {
  const client = new S3Client({ region: 'ap-northeast-2' })

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: `${IMPORT_DIR}/${filename}`,
    ContentType: 'text/csv'
  })

  const url = await getSignedUrl(client, command, { expiresIn: 3600 })

  return formatJSONResponse(url);
}

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  console.log('=== REQUEST ===', event)
  
  const filename = event.queryStringParameters?.name

  return await innerHandler(filename)
}

export const main = middyfy(importProductsFile);
