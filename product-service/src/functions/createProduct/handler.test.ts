import { formatJSONResponse } from "@libs/apiGateway"
import { BadRequestException } from "src/classes/BadRequestException"
import { Exception } from "src/classes/Exception"
import { innerHandler } from "./handler"

test('Get Bad request exception when title is undefined', async () => {
  const newProduct = {
    description: '',
    price: 1,
    count: 1
  }
  const mockCreateInDB = jest.fn()

  const exception = await innerHandler(newProduct, mockCreateInDB)

  expect(exception).toBeInstanceOf(BadRequestException)
  expect(exception.body).toBe('{"statusCode":400,"message":"\\"title\\" is required"}')
})

test('Get Bad request exception when title is empty string', async () => {
  const newProduct = {
    title: '',
    description: '',
    price: 1,
    count: 1
  }
  const mockCreateInDB = jest.fn()

  const exception = await innerHandler(newProduct, mockCreateInDB)

  expect(exception).toBeInstanceOf(BadRequestException)
  expect(exception.body).toBe('{"statusCode":400,"message":"\\"title\\" is not allowed to be empty"}')
})

test('Get Bad request exception when title is not string', async () => {
  const newProduct = {
    title: 1,
    description: '',
    price: 1,
    count: 1
  }
  const mockCreateInDB = jest.fn()

  const exception = await innerHandler(newProduct, mockCreateInDB)

  expect(exception).toBeInstanceOf(BadRequestException)
  expect(exception.body).toBe('{"statusCode":400,"message":"\\"title\\" must be a string"}')
})

test('Get Bad request exception when description is not string', async () => {
  const newProduct = {
    title: 'title',
    description: 1,
    price: 1,
    count: 1
  }
  const mockCreateInDB = jest.fn()

  const exception = await innerHandler(newProduct, mockCreateInDB)

  expect(exception).toBeInstanceOf(BadRequestException)
  expect(exception.body).toBe('{"statusCode":400,"message":"\\"description\\" must be a string"}')
})

test('Get Bad request exception when price is undefined', async () => {
  const newProduct = {
    title: 'title',
    description: '',
    count: 1
  }
  const mockCreateInDB = jest.fn()

  const exception = await innerHandler(newProduct, mockCreateInDB)

  expect(exception).toBeInstanceOf(BadRequestException)
  expect(exception.body).toBe('{"statusCode":400,"message":"\\"price\\" is required"}')
})

test('Get Bad request exception when price is not number', async () => {
  const newProduct = {
    title: 'title',
    description: '',
    price: 'price',
    count: 1
  }
  const mockCreateInDB = jest.fn()

  const exception = await innerHandler(newProduct, mockCreateInDB)

  expect(exception).toBeInstanceOf(BadRequestException)
  expect(exception.body).toBe('{"statusCode":400,"message":"\\"price\\" must be a number"}')
})

test('Get Bad request exception when count is undefined', async () => {
  const newProduct = {
    title: 'title',
    description: '',
    price: 1
  }
  const mockCreateInDB = jest.fn()

  const exception = await innerHandler(newProduct, mockCreateInDB)

  expect(exception).toBeInstanceOf(BadRequestException)
  expect(exception.body).toBe('{"statusCode":400,"message":"\\"count\\" is required"}')
})

test('Get Bad request exception when count is not number', async () => {
  const newProduct = {
    title: 'title',
    description: '',
    price: 1,
    count: 'count'
  }
  const mockCreateInDB = jest.fn()

  const exception = await innerHandler(newProduct, mockCreateInDB)

  expect(exception).toBeInstanceOf(BadRequestException)
  expect(exception.body).toBe('{\"statusCode\":400,\"message\":\"\\\"count\\\" must be a number\"}')
})

test('Get Bad server exception by any other errors', async () => {
  const newProduct = {
    title: 'title',
    description: '',
    price: 1,
    count: 1
  }
  const mockCreateInDB = jest.fn(() => { throw new Error('test') })

  const exception = await innerHandler(newProduct, mockCreateInDB)

  expect(exception).toBeInstanceOf(Exception)
  expect(exception.body).toBe('{"statusCode":500,"message":"Internal server error"}')
})

test('Get the newly created product after successful creation', async () => {
  const newProduct = {
    title: 'title',
    description: '',
    price: 1,
    count: 1
  }
  const createdProduct = {
    id: 'a7ba3c0b-936b-4637-bf84-67f5e9a403b5',
    ...newProduct
  }
  const mockCreateInDB = jest.fn().mockReturnValue(createdProduct)

  const response = await innerHandler(newProduct, mockCreateInDB)

  expect(response).toMatchObject(formatJSONResponse(createdProduct, 201))
})

