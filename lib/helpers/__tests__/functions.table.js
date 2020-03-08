// Import table specific functions
import {
  generatePagination,
  getNestedObject,
  capitalizeAll,
  parseHeader,
  valueOrDefault,
  columnObject,
} from '../functions'

// Random integer generator
const getRandomInt = (max = 10) => Math.floor(Math.random() * Math.floor(max))

// Define the tests

test('testing generatePagination(), should return an array of objects with specific keys', () => {
  const total = getRandomInt(100)
  const active = getRandomInt(total)
  const pagination = generatePagination(active, total)
  for (const page of pagination) {
    expect(page).toMatchObject({
      active: expect.any(Boolean),
      text: expect.any(String),
    })
    expect(page).toHaveProperty('value')
    const { value } = page
    if (typeof value !== 'undefined') {
      expect(typeof value).toBe('number')
    } else {
      expect(value).toBeUndefined()
    }
  }
})

test('testing getNestedObject(), should return a nested value or null', () => {
  const nestedObject = {
    one: 1,
    two: {
      twoOne: 1,
      twoTwo: {
        twoTwoOne: 1,
      },
    },
  }
  const oneLevelValue = getNestedObject(nestedObject, ['one'])
  const twoLevelValue = getNestedObject(nestedObject, ['two', 'twoOne'])
  const threeLevelValue = getNestedObject(nestedObject, ['two', 'twoTwo', 'twoTwoOne'])
  const fourLevelValue = getNestedObject(nestedObject, ['two, twoTwo', 'twoTwoTwo', 'twoTwoTwo'])
  expect(oneLevelValue).toBe(nestedObject.one)
  expect(twoLevelValue).toBe(nestedObject.two.twoOne)
  expect(threeLevelValue).toBe(nestedObject.two.twoTwo.twoTwoOne)
  expect(fourLevelValue).toBeUndefined()
})

test('testing capitalizeAll(), should capitalize the first letter in a word', () => {
  const testString = 'all existence is futile'.split(' ')
  const expectedString = 'All Existence Is Futile'
  expect(capitalizeAll(testString)).toBe(expectedString)
})

test('testing parseHeader(), should parse the header correctly', () => {
  const testString = '--this_IS aSomehow -very.Wrong._header'
  const expectedString = 'This Is A Somehow Very Wrong Header'
  expect(parseHeader(testString)).toBe(expectedString)
})

test('testing valueOrDefault(), should return the default on undefined', () => {
  expect(valueOrDefault(undefined, 'default')).toBe('default')
  expect(valueOrDefault(1, 'default')).toBe(1)
})

test('testing columnObject(), should return a well defined column object', () => {
  const properties = ['key', 'text', 'invisible', 'sortable', 'filterable']
  const column = columnObject('columnKey')
  for (const property of properties) {
    expect(column).toHaveProperty(property)
  }
})
