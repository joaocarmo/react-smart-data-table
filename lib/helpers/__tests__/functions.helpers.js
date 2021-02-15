import {
  head,
  tail,
  isString,
  isArray,
  isObject,
  isEmpty,
  isFunction,
  isNumber,
  isUndefined,
} from '../functions'
import { getRandomInt } from '../tests'

// Set different object types
const objectTypes = {
  string: 'string',
  number: 1,
  array: [],
  object: {},
  function: () => null,
  undefined,
}

const objectTypesTests = Object.entries(objectTypes)

// Set empty / non-empty object types
const emptyNotEmpty = {
  emptyArray: [],
  emptyObject: {},
  notEmptyArray: [1],
  notEmptyObject: { one: 1 },
}

const emptyNotEmptyTests = Object.entries(emptyNotEmpty)

test('head(), should return the first element in an array', () => {
  const randArr = Array(getRandomInt(100))
  const randVal = getRandomInt(100)
  randArr[0] = randVal
  expect(head(randArr)).toBe(randVal)
})

test('tail(), should return the last element in an array', () => {
  const randArr = Array(getRandomInt(100))
  const randVal = getRandomInt(100)
  randArr[randArr.length - 1] = randVal
  expect(tail(randArr)).toBe(randVal)
})

describe('isString(), should be true only for strings', () => {
  test.each(objectTypesTests)('Testing %s', (type, value) => {
    expect(type !== 'string' || (type === 'string' && isString(value))).toBe(
      true,
    )
    expect(type !== 'string' && isString(value)).toBe(false)
  })
})

describe('isArray(), should be true only for arrays', () => {
  test.each(objectTypesTests)('Testing %s', (type, value) => {
    expect(type !== 'array' || (type === 'array' && isArray(value))).toBe(true)
    expect(type !== 'array' && isArray(value)).toBe(false)
  })
})

describe('isObject(), should be true only for objects', () => {
  test.each(objectTypesTests)('Testing %s', (type, value) => {
    expect(type !== 'object' || (type === 'object' && isObject(value))).toBe(
      true,
    )
    expect(type !== 'object' && isObject(value)).toBe(false)
  })
})

describe('isFunction(), should be true only for functions', () => {
  test.each(objectTypesTests)('Testing %s', (type, value) => {
    expect(
      type !== 'function' || (type === 'function' && isFunction(value)),
    ).toBe(true)
    expect(type !== 'function' && isFunction(value)).toBe(false)
  })
})

describe('isNumber(), should be true only for numbers', () => {
  test.each(objectTypesTests)('Testing %s', (type, value) => {
    expect(type !== 'number' || (type === 'number' && isNumber(value))).toBe(
      true,
    )
    expect(type !== 'number' && isNumber(value)).toBe(false)
  })
})

describe('isUndefined(), should be true only for undefined', () => {
  test.each(objectTypesTests)('Testing %s', (type, value) => {
    expect(
      type !== 'undefined' || (type === 'undefined' && isUndefined(value)),
    ).toBe(true)
    expect(type !== 'undefined' && isUndefined(value)).toBe(false)
  })
})

describe('isEmpty(), should be true only for empty arrays/objects', () => {
  test.each(emptyNotEmptyTests)('Testing %s is empty', (type, value) => {
    expect(
      !type.startsWith('empty') || (type.startsWith('empty') && isEmpty(value)),
    ).toBe(true)
    expect(!type.startsWith('empty') && isEmpty(value)).toBe(false)
  })

  test.each(emptyNotEmptyTests)('Testing %s is not empty', (type, value) => {
    expect(
      !type.startsWith('notEmpty') ||
        (type.startsWith('notEmpty') && !isEmpty(value)),
    ).toBe(true)
    expect(!type.startsWith('notEmpty') && !isEmpty(value)).toBe(false)
  })
})
