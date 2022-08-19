import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { middyfy } from '@libs/lambda';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { Exception } from 'src/classes/Exception';
import { innerHandler as createProductHandler, createInDB } from '../createProduct/handler'

const publish = async (product: string) => {
  try {
    const snsClient = new SNSClient({ region: 'ap-northeast-2' })
    const publishCommand = new PublishCommand({
      Subject: `[Yulei's Book Store]A new book!`,
      Message: `A new book is published: ${product}`,
      TopicArn: process.env.SNS_ARN,
      
    })
    await snsClient.send(publishCommand)
  } catch (error) {
    throw error
  }
} 

export const innerHandler = async (records: SQSRecord[]) => {
  try {
    for (const record of records) {
      const product = JSON.parse(record.body)
      const result = await createProductHandler(product, createInDB)
      await publish(JSON.stringify(product))
      return result
    }
  } catch (error) {
    console.error(error)
    return new Exception()
  }
}

export const catalogBatchProcess = async (event: SQSEvent) => {
  console.log('=== SQS Event ===', event);
  
  const records = event.Records

  const response = await innerHandler(records) 
  console.log('=== RESPONSE ===', response)
  return response
}

export const main = middyfy(catalogBatchProcess);
