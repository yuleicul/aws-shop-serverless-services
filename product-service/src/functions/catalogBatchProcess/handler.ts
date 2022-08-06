import { middyfy } from '@libs/lambda';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { Exception } from 'src/classes/Exception';
import { innerHandler as createProductHandler, createInDB } from '../createProduct/handler'

export const innerHandler = async (records: SQSRecord[]) => {
  try {
    for (const record of records) {
      const product = JSON.parse(record.body)
      return await createProductHandler(product, createInDB)
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
