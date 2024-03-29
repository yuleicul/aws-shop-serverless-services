import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { S3Event, S3EventRecord } from "aws-lambda";
// import * as csv from 'csv-parser' // wow how?
import neatCsv from 'neat-csv'
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { BUCKET, IMPORT_DIR, MOVE_DIR } from '@libs/constant';
import { Exception } from "@libs/exception/Exception";
import { Product } from "./schema";

/**
 * Move the uploaded file from `/uploaded` to `/parsed`
 */
const moveFile = async (client: S3Client, record: S3EventRecord) => {

  try {
    const copyCommand = new CopyObjectCommand({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${record.s3.object.key}`,
      Key: record.s3.object.key.replace(IMPORT_DIR, MOVE_DIR)
    })
  
    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: record.s3.object.key
    })
  
    await client.send(copyCommand)
    await client.send(deleteCommand)
  } catch (error) {
    throw error
  }
}

const innerHandler = async (records: S3EventRecord[]) => {
  const s3Client = new S3Client({ region: 'ap-northeast-2' })
  const sqsClient = new SQSClient({ region: 'ap-northeast-2' })

  try {
    for (const record of records) {
      const getObjectCommand = new GetObjectCommand({
        Bucket: BUCKET,
        Key: record.s3.object.key,
      })
      const response = await s3Client.send(getObjectCommand)
      // response.Body is already a readable stream since aws-sdk v3:
      // https://github.com/aws/aws-sdk-js-v3/issues/1096#issuecomment-620900466
      const results = await neatCsv<Product>(response.Body)
      console.log('=== results ===', results)

      moveFile(s3Client, record)

      await Promise.all(results.map(async result => {
        const sendMessageCommand = new SendMessageCommand({
          QueueUrl: process.env.SQS_URL,
          MessageBody: JSON.stringify(result)
        })
        return sqsClient.send(sendMessageCommand)
      }))
        .then((messages) => {
          console.log(`=== SENT TO SQS: ${process.env.SQS_URL} ===`, messages)
        })
        .catch(err => console.error(err))

      return formatJSONResponse({}, 202);
    }
  } catch (error) {
    console.log(error)
    return new Exception()
  }
}

const importFileParser = async (event: S3Event) => {
  console.log('=== S3 Event ===', JSON.stringify(event))

  const response = await innerHandler(event.Records)
  console.log('=== response ===', response)
  return response
}

export const main = middyfy(importFileParser);
