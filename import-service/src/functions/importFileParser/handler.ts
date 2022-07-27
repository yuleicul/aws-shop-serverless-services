import { S3Client, GetObjectCommand} from "@aws-sdk/client-s3";
import { S3Event, S3EventRecord } from "aws-lambda";
// import * as csv from 'csv-parser' // wow how?
import neatCsv from 'neat-csv'

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { BUCKET } from '@libs/constant';
import { Exception } from "@libs/exception/Exception";

const innerHandler = async (records: S3EventRecord[]) => {
  const client = new S3Client({ region: 'ap-northeast-2' })

  try {
    for (const record of records) {
      const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: record.s3.object.key,
      })
      const response = await client.send(command)
      // response.Body is already a readable stream since aws-sdk v3:
      // https://github.com/aws/aws-sdk-js-v3/issues/1096#issuecomment-620900466
      const results = await neatCsv(response.Body)
      console.log('=== results ===', results)
    }
  } catch (error) {
    console.log(error)
    return new Exception()
  }

  return formatJSONResponse({}, 202);
}

const importFileParser = async (event: S3Event) => {
  console.log('=== S3 Event ===', JSON.stringify(event))

  const response = await innerHandler(event.Records)
  console.log('=== response ===', response)
  return response
}

export const main = middyfy(importFileParser);
