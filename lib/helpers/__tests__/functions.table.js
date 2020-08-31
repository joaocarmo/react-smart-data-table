// Import table specific functions
import {
  generatePagination,
  getNestedObject,
  capitalizeAll,
  parseHeader,
  valueOrDefault,
  columnObject,
  parseDataForColumns,
  parseDataForRows,
  filterRowsByValue,
  sliceRowsPerPage,
  sortData,
  isDataURL,
  isImage,
  highlightValueParts,
} from '../functions'
import { getRandomInt, imgb64 } from '../tests'

// Define the tests

test('generatePagination(), should return an array of objects with specific keys', () => {
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

test('getNestedObject(), should return a nested value or null', () => {
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
  const threeLevelValue = getNestedObject(nestedObject, [
    'two',
    'twoTwo',
    'twoTwoOne',
  ])
  const fourLevelValue = getNestedObject(nestedObject, [
    'two, twoTwo',
    'twoTwoTwo',
    'twoTwoTwo',
  ])
  expect(oneLevelValue).toBe(nestedObject.one)
  expect(twoLevelValue).toBe(nestedObject.two.twoOne)
  expect(threeLevelValue).toBe(nestedObject.two.twoTwo.twoTwoOne)
  expect(fourLevelValue).toBeUndefined()
})

test('capitalizeAll(), should capitalize the first letter in a word', () => {
  const testString = 'all existence is futile'.split(' ')
  const expectedString = 'All Existence Is Futile'
  expect(capitalizeAll(testString)).toBe(expectedString)
})

test('parseHeader(), should parse the header correctly', () => {
  const tests = [
    {
      key: '--this_IS aSomehow -very.Wrong._header',
      expected: 'This Is A Somehow Very Wrong Header',
    },
    {
      key: 'one.0.two.1.three.99.fromArray',
      expected: 'One Two Three From Array',
    },
    {
      key: 'last_1k_p99_requests',
      expected: 'Last 1K P99 Requests',
    },
  ]
  for (const test of tests) {
    const { key: testString, expected: expectedString } = test
    expect(parseHeader(testString)).toBe(expectedString)
  }
})

test('valueOrDefault(), should return the default on undefined', () => {
  expect(valueOrDefault(undefined, 'default')).toBe('default')
  expect(valueOrDefault(1, 'default')).toBe(1)
})

test('columnObject(), should return a well defined column object', () => {
  const properties = ['key', 'text', 'invisible', 'sortable', 'filterable']
  const column = columnObject('columnKey')
  for (const property of properties) {
    expect(column).toHaveProperty(property)
  }
})

test('parseDataForColumns(), should build the columns based on the object', () => {
  const sample = [
    {
      _id: 'id',
      address: {
        city: 'city',
        state: 'state',
        country: 'country',
      },
      url: 'url',
      isMarried: 'isMarried',
      actions: 'actions',
      avatar: 'avatar',
      fullName: 'fullName',
      _username: 'username',
      password_: 'password',
      'email.address': 'emailAddress',
      phone_number: 'phoneNumber',
      last_1k_p99_requests: 'last1KP99Requests',
    },
  ]
  const expectedData = [
    {
      key: '_id',
      text: 'Id',
      invisible: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'avatar',
      text: 'Avatar',
      invisible: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'fullName',
      text: 'Full Name',
      invisible: false,
      sortable: true,
      filterable: true,
    },
    {
      key: '_username',
      text: 'Username',
      invisible: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'password_',
      text: 'Password',
      invisible: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'email.address',
      text: 'Email Address',
      invisible: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'phone_number',
      text: 'Phone Number',
      invisible: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'address.city',
      text: 'Address City',
      invisible: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'address.state',
      text: 'Address State',
      invisible: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'address.country',
      text: 'Address Country',
      invisible: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'url',
      text: 'Url',
      invisible: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'isMarried',
      text: 'Is Married',
      invisible: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'actions',
      text: 'Actions',
      invisible: false,
      sortable: true,
      filterable: true,
    },
    // one.0.two.1.three.99.fromArray
    {
      key: 'one.0.two.1.three.99.fromArray',
      text: 'One Two Three From Array',
      invisible: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'last_1k_p99_requests',
      text: 'Last 1K P99 Requests',
      invisible: false,
      sortable: true,
      filterable: true,
    },
  ]
  const headers = {}
  const orderedHeaders = [
    '_id',
    'avatar',
    'fullName',
    '_username',
    'password_',
    'email.address',
    'phone_number',
    'address.city',
    'address.state',
    'address.country',
    'url',
    'isMarried',
    'actions',
    'one.0.two.1.three.99.fromArray',
    'last_1k_p99_requests',
  ]
  const hideUnordered = true
  const parsedData = parseDataForColumns(
    sample,
    headers,
    orderedHeaders,
    hideUnordered,
  )
  expect(parsedData).toEqual(expectedData)
})

test('parseDataForRows(), should clear empty and non-object rows and flatten the remaining', () => {
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

test('filterRowsByValue(), should return only the entries which match the search string', () => {
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

test('sliceRowsPerPage(), should return a properly sized array', () => {
  const N = getRandomInt(100)
  const data = Array(N)
  const currentPage = 1
  const perPage = [10, 25, 50, 100][getRandomInt(4)]
  const slicedData = sliceRowsPerPage(data, currentPage, perPage)
  expect(Array.isArray(slicedData)).toBe(true)
  expect(slicedData).toHaveLength(Math.min(N, perPage))
})

test('sortData(), should return a properly sorted array', () => {
  const filter = ''
  const opts = { filterable: false }
  const sorting = { key: 'name', dir: 'ASC' }
  const data = [
    { name: 'john' },
    { name: 'peter' },
    { name: 'anna' },
    { name: 'yasmin' },
  ]
  const sortedDataAsc = [
    { name: 'anna' },
    { name: 'john' },
    { name: 'peter' },
    { name: 'yasmin' },
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

test('isDataURL(), should return true if data is an enconded image', () => {
  const tests = [
    ...negativeImgTests,
    {
      data: imgb64,
      expected: true,
    },
  ]
  for (const test of tests) {
    const { data, expected } = test
    expect(isDataURL(data)).toBe(expected)
  }
})

test('isImage(), should return true if string is an image url', () => {
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

test('highlightValueParts(), should return an object of split parts', () => {
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
