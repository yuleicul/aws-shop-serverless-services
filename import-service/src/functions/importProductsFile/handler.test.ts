
import { mockClient } from 'aws-sdk-client-mock';
import { S3Client, PutObjectAclCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { innerHandler } from './handler'

jest.mock('@aws-sdk/s3-request-presigner')

const SIGNED_URL = 'signed url'

beforeAll(() => {
  const s3ClientMock = mockClient(S3Client)
  s3ClientMock.on(PutObjectAclCommand).resolves({})
  
  // @ts-ignore
  getSignedUrl.mockReturnValue(Promise.resolve(SIGNED_URL))
})

it('should return bad request exception if `filename` is empty', async () => {
  const result = await innerHandler()

  expect(result.statusCode).toBe(400)
  expect(result.body).toBe('{"statusCode":400,"message":"`filename` is required"}')
})

it('should return signed url in response body', async () => {
  const result = await innerHandler('test.csv')

  expect(result.statusCode).toBe(200)
  expect(result.body).toBe(SIGNED_URL)
})