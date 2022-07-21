import { findProductById } from "./handler"

export const existentId = 'P0001'
const nonexistentId = 'none'

test('Get product by existent ID', () => {
  expect(findProductById(existentId)).not.toBe(undefined)
})

test('Get undefined by nonexistent ID', () => {
  expect(findProductById(nonexistentId)).toBe(undefined)
})
