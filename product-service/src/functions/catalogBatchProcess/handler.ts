import { middyfy } from '@libs/lambda';
import { SQSEvent, SQSRecord } from 'aws-lambda';

export const innerHandler = async (records: SQSRecord[]) => {

}

export const catalogBatchProcess = async (event: SQSEvent) => {
  console.log('=== SQS Event ===', event);
  
  const records = event.Records

  const response = await innerHandler(records) 
  console.log('=== RESPONSE ===', response)
  return response
}

export const main = middyfy(catalogBatchProcess);
