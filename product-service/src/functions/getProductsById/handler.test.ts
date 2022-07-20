import { findProductById } from "./handler"

export const existentId = '4f33097e-6e63-4187-8e19-7270b9ddda22'
const nonexistentId = 'none'

test('Get product by existent ID', () => {
  expect(findProductById(existentId)).not.toBe(undefined)
})

test('Get undefined by nonexistent ID', () => {
  expect(findProductById(nonexistentId)).toBe(undefined)
})
