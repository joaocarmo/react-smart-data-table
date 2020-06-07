// Test Lodash alternatives
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

// Set empty / non-empty object types
const emptyNotEmpty = {
  empty: [[], {}],
  notEmpty: [[1], { one: 1 }],
}

// Define the tests

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

test('isString(), should be true only for strings', () => {
  const { string: stringType, ...otherTypes } = objectTypes
  expect(isString(stringType)).toBe(true)
  for (const type in otherTypes) {
    if ({}.hasOwnProperty.call(otherTypes, type)) {
      expect(isString(otherTypes[type])).toBe(false)
    }
  }
})

test('isArray(), should be true only for arrays', () => {
  const { array: arrayType, ...otherTypes } = objectTypes
  expect(isArray(arrayType)).toBe(true)
  for (const type in otherTypes) {
    if ({}.hasOwnProperty.call(otherTypes, type)) {
      expect(isArray(otherTypes[type])).toBe(false)
    }
  }
})

test('isObject(), should be true only for objects', () => {
  const { object: objectType, ...otherTypes } = objectTypes
  expect(isObject(objectType)).toBe(true)
  for (const type in otherTypes) {
    if ({}.hasOwnProperty.call(otherTypes, type)) {
      expect(isObject(otherTypes[type])).toBe(false)
    }
  }
})

test('isFunction(), should be true only for functions', () => {
  const { function: functionType, ...otherTypes } = objectTypes
  expect(isFunction(functionType)).toBe(true)
  for (const type in otherTypes) {
    if ({}.hasOwnProperty.call(otherTypes, type)) {
      expect(isFunction(otherTypes[type])).toBe(false)
    }
  }
})

test('isNumber(), should be true only for numbers', () => {
  const { number: numberType, ...otherTypes } = objectTypes
  expect(isNumber(numberType)).toBe(true)
  for (const type in otherTypes) {
    if ({}.hasOwnProperty.call(otherTypes, type)) {
      expect(isNumber(otherTypes[type])).toBe(false)
    }
  }
})

test('isUndefined(), should be true only for undefined', () => {
  const { undefined: undefinedType, ...otherTypes } = objectTypes
  expect(isUndefined(undefinedType)).toBe(true)
  for (const type in otherTypes) {
    if ({}.hasOwnProperty.call(otherTypes, type)) {
      expect(isUndefined(otherTypes[type])).toBe(false)
    }
  }
})

test('isEmpty(), should be true only for empty arrays/objects', () => {
  const { empty, notEmpty } = emptyNotEmpty
  for (const type of empty) {
    expect(isEmpty(type)).toBe(true)
  }
  for (const type of notEmpty) {
    expect(isEmpty(type)).toBe(false)
  }
})
