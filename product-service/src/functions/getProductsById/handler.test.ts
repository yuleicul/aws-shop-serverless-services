import { formatJSONResponse } from "@libs/apiGateway";
import { BadRequestException } from "src/classes/BadRequestException";
import { Exception } from "src/classes/Exception";
import { NotFoundException } from "src/classes/NotFoundException";
import { innerHandler } from "./handler";

const NON_UUID = 'non-uuid'
const NON_EXIST_UUID = '4f33097e-6e63-4187-8e19-7270b9ddda12'
const EXIST_UUID = '4f33097e-6e63-4187-8e19-7270b9ddda22'
const CORRESPOND_PRODUCT = {
  id: '4f33097e-6e63-4187-8e19-7270b9ddda22',
  title: 'The Maid',
  description: '#1 NEW YORK TIMES BESTSELLER • GOOD MORNING AMERICA BOOK CLUB PICK',
  price: 14,
  count: 3
}

test('Get Bad request exception by non-uuid', async () => {
  const productId = NON_UUID
  const mockFindProductByIdInDB = jest.fn()

  const exception = await innerHandler(productId, mockFindProductByIdInDB)

  expect(exception).toBeInstanceOf(BadRequestException)
  expect(exception.body).toBe('{"statusCode":400,"message":"\\"value\\" must be a valid GUID"}')
})

test('Get Not found exception by non-existent uuid', async () => {
  const productId = NON_EXIST_UUID
  const mockFindProductByIdInDB = jest.fn().mockReturnValue(undefined)

  const exception = await innerHandler(productId, mockFindProductByIdInDB)

  expect(exception).toBeInstanceOf(NotFoundException)
  expect(exception.body).toBe('{"statusCode":404,"message":"Product not found"}')
})

test('Get Bad server exception by any other errors', async () => {
  const productId = EXIST_UUID
  const mockFindProductByIdInDB = jest.fn(() => {throw new Error('test')})

  const exception = await innerHandler(productId, mockFindProductByIdInDB)

  expect(exception).toBeInstanceOf(Exception)
  expect(exception.body).toBe('{"statusCode":500,"message":"Internal server error"}')
})

test('Get product by existent uuid', async () => {
  const productId = EXIST_UUID
  const product = CORRESPOND_PRODUCT
  const mockFindProductByIdInDB = jest.fn().mockReturnValue(product)

  const response = await innerHandler(productId, mockFindProductByIdInDB)

  expect(response).toMatchObject(formatJSONResponse(product))
})
