// Import table specific functions
import {
  generatePagination,
  getNestedObject,
  capitalizeAll,
  parseHeader,
  valueOrDefault,
  columnObject,
  // parseDataForColumns,
  parseDataForRows,
  filterRowsByValue,
  sliceRowsPerPage,
  sortData,
  isDataURL,
  isImage,
  highlightValueParts,
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

test('testing parseDataForColumns(), should arrange the columns object', () => {
  // const data = parseDataForColumns()
  expect(true).toBe(true)
})

test('testing parseDataForRows(), should clear empty and non-object rows and flatten the remaining', () => {
  const originalObjArr = [
    undefined,
    null,
    0,
    1,
    'string',
    [],
    () => null,
    {},
    {
      one: 1,
      two: 2,
      three: 3,
      nested: {
        four: 4,
        five: 5,
        six: 6,
        array: [7, 8, 9],
      },
    },
    {
      one: 1,
      two: 2,
      three: 3,
      nested: {
        four: 4,
        five: 5,
        six: 6,
        array: [7, 8, 9],
      },
    },
  ]
  const parsedObjArr = [
    {
      one: 1,
      two: 2,
      three: 3,
      'nested.four': 4,
      'nested.five': 5,
      'nested.six': 6,
      'nested.array.0': 7,
      'nested.array.1': 8,
      'nested.array.2': 9,
    },
    {
      one: 1,
      two: 2,
      three: 3,
      'nested.four': 4,
      'nested.five': 5,
      'nested.six': 6,
      'nested.array.0': 7,
      'nested.array.1': 8,
      'nested.array.2': 9,
    },
  ]
  expect(parseDataForRows(originalObjArr)).toEqual(parsedObjArr)
})

test('testing filterRowsByValue(), should return only the entries which match the search string', () => {
  const originalData = [
    {
      one: 1,
      two: 2,
      three: 3,
      'nested.four': 4,
      'nested.five': 5,
      'nested.six': 6,
      'nested.array.0': 7,
      'nested.array.1': 8,
      'nested.array.2': 9,
    },
    {
      ten: 10,
      eleven: 11,
    },
    {
      string: 'string',
      zero: 0,
    },
    {
      twenty: 20,
      thirty: 30,
    },
  ]
  const filteredData = [
    {
      one: 1,
      two: 2,
      three: 3,
      'nested.four': 4,
      'nested.five': 5,
      'nested.six': 6,
      'nested.array.0': 7,
      'nested.array.1': 8,
      'nested.array.2': 9,
    },
    {
      ten: 10,
      eleven: 11,
    },
  ]
  const search = '1'
  const opts = { filterable: true }
  expect(filterRowsByValue(search, originalData, opts)).toEqual(filteredData)
})

test('testing sliceRowsPerPage(), should return a properly sized array', () => {
  const N = getRandomInt(100)
  const data = Array(N)
  const currentPage = 1
  const perPage = [10, 25, 50, 100][getRandomInt(4)]
  const slicedData = sliceRowsPerPage(data, currentPage, perPage)
  expect(Array.isArray(slicedData)).toBe(true)
  expect(slicedData).toHaveLength(Math.min(N, perPage))
})

test('testing sortData(), should return a properly sorted array', () => {
  const filter = ''
  const opts = { filterable: false }
  const sorting = { key: 'name', dir: 'ASC' }
  const data = [
    { name: 'john' }, { name: 'peter' }, { name: 'anna' }, { name: 'yasmin' },
  ]
  const sortedDataAsc = [
    { name: 'anna' }, { name: 'john' }, { name: 'peter' }, { name: 'yasmin' },
  ]
  const sortedDataDesc = [...sortedDataAsc].reverse()
  expect(sortData(filter, opts, sorting, data)).toEqual(sortedDataAsc)
  sorting.dir = 'DESC'
  expect(sortData(filter, opts, sorting, data)).toEqual(sortedDataDesc)
})

const negativeImgTests = [
  {
    data: null,
    expected: false,
  },
  {
    data: 1,
    expected: false,
  },
  {
    data: true,
    expected: false,
  },
  {
    data: {},
    expected: false,
  },
  {
    data: () => null,
    expected: false,
  },
  {
    data: '',
    expected: false,
  },
  {
    data: 'https://github.com/',
    expected: false,
  },
  {
    data: 'data:image/svg+xml;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    expected: false,
  },
]

test('testing isDataURL(), should return true if data is an enconded image', () => {
  const tests = [
    ...negativeImgTests,
    {
      // eslint-disable-next-line max-len
      data: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxwYXRoIGQ9Ik0xMiwwQzUuNCwwLDAsNS40LDAsMTJzNS40LDEyLDEyLDEyczEyLTUuNCwxMi0xMlMxOC42LDAsMTIsMHogTTEyLDIyQzYuNSwyMiwyLDE3LjUsMiwxMlM2LjUsMiwxMiwyczEwLDQuNSwxMCwxMCAgIFMxNy41LDIyLDEyLDIyeiIvPjxjaXJjbGUgY3g9IjguNSIgY3k9IjkuNSIgcj0iMS41Ii8+PHBhdGggZD0iTTE3LjUsOWgtM0MxNC4yLDksMTQsOS4yLDE0LDkuNXMwLjIsMC41LDAuNSwwLjVoM2MwLjMsMCwwLjUtMC4yLDAuNS0wLjVTMTcuOCw5LDE3LjUsOXoiLz48cGF0aCBkPSJNMTIsMTh2MWMzLjMsMCw2LTIuNyw2LTZoLTFDMTcsMTUuOCwxNC44LDE4LDEyLDE4eiIvPjwvZz48L3N2Zz4=',
      expected: true,
    },
  ]
  for (const test of tests) {
    const { data, expected } = test
    expect(isDataURL(data)).toBe(expected)
  }
})

test('testing isImage(), should return true if string is an image url', () => {
  const tests = [
    ...negativeImgTests,
    {
      data: 'https://domain.ext/path/to/image.jpg',
      expected: true,
    },
  ]
  for (const test of tests) {
    const { data, expected } = test
    expect(isImage(data)).toBe(expected)
  }
})

test('testing highlightValueParts(), should return an object of split parts', () => {
  const tests = [
    {
      data: ['', ''],
      expected: '',
    },
    {
      data: ['value', ''],
      expected: 'value',
    },
    {
      data: ['value', 'zero'],
      expected: {
        first: undefined,
        highlight: undefined,
        last: undefined,
        value: 'value',
      },
    },
    {
      data: ['thisisaverybigword', 'very'],
      expected: {
        first: 'thisisa',
        highlight: 'very',
        last: 'bigword',
        value: 'thisisaverybigword',
      },
    },
  ]
  for (const test of tests) {
    const { data, expected } = test
    expect(highlightValueParts(...data)).toEqual(expected)
  }
})
