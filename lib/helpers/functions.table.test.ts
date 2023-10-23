import type { ReactNode } from 'react'
import {
  capitalizeAll,
  columnObject,
  fetchData,
  filterRowsByValue,
  generatePagination,
  getNestedObject,
  getRenderValue,
  getSampleElement,
  highlightValueParts,
  isDataURL,
  isImage,
  parseDataForColumns,
  parseDataForRows,
  parseHeader,
  sliceRowsPerPage,
  sortData,
  valueOrDefault,
  FetchDataOptions,
  Headers,
  Highlight,
  RenderOptions,
  Sorting,
  UnknownObject,
} from './functions'
import { DEFAULT_NO_WORD, DEFAULT_YES_WORD } from './constants'
import { getRandomInt, imgb64 } from './tests'

const negativeImgTests: [unknown, boolean][] = [
  [null, false],
  [1, false],
  [true, false],
  [{}, false],
  [() => null, false],
  ['', false],
  ['https://github.com/', false],
  ['data:image/svg+xml;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', false],
]

type FetchData = Record<string, string>

type ReturnFetchData = FetchData[] | { results: FetchData[] }

describe('fetchData(), should return remote data', () => {
  const staticData: FetchData[] = [{ foo: 'foo', bar: 'bar' }]
  const remoteData: ReturnFetchData = { results: staticData }

  beforeEach(() => {
    fetchMock.mockResponseOnce(JSON.stringify(remoteData), {
      headers: { 'content-type': 'application/json' },
    })
  })

  const tests: [
    string,
    string | unknown[],
    FetchDataOptions,
    ReturnFetchData,
  ][] = [
    ['static data', staticData, undefined, staticData],
    ['remote data', 'https://example.com/api/v1/users', undefined, undefined],
    [
      'remote data',
      'https://example.com/api/v1/users',
      { dataKey: '' },
      remoteData,
    ],
    [
      'remote data',
      'https://example.com/api/v1/users',
      { dataKey: 'results' },
      remoteData.results,
    ],
    [
      'remote data',
      'https://example.com/api/v1/users',
      {
        dataKeyResolver: (response) => response.results as UnknownObject[],
      },
      remoteData.results,
    ],
    [
      'remote data with options',
      'https://example.com/api/v1/users',
      {
        dataKeyResolver: (response) => response.results as UnknownObject[],
        options: {
          method: 'post',
          body: JSON.stringify({ page: 2 }),
        },
      },
      remoteData.results,
    ],
  ]

  it.each(tests)('Testing %s', async (name, data, options, expected) => {
    await expect(fetchData(data, options)).resolves.toEqual(expected)
  })

  it('Checks the fetch calls', () => {
    const numRemoteCalls = tests.filter(
      ([, data]) => typeof data === 'string',
    ).length
    expect(fetchMock.mock.calls.length).toEqual(numRemoteCalls)
  })
})

describe('generatePagination(), should return an array of objects with specific keys', () => {
  const total = getRandomInt(100)
  const active = getRandomInt(total)
  const pagination = generatePagination(active, total)

  test.each(pagination)('Page %#', (page) => {
    const { value } = page

    expect(page).toMatchObject({
      active: expect.any(Boolean) as boolean,
      text: expect.any(String) as string,
    })
    expect(page).toHaveProperty('value')
    expect(
      typeof value === 'undefined' ||
        (typeof value !== 'undefined' && typeof value === 'number'),
    ).toBe(true)
  })
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

describe('parseHeader(), should parse the header correctly', () => {
  const tests = [
    [
      '--this_IS aSomehow -very.Wrong._header',
      'This Is A Somehow Very Wrong Header',
    ],
    ['one.0.two.1.three.99.fromArray', 'One Two Three From Array'],
    ['last_1k_p99_requests', 'Last 1K P99 Requests'],
  ]

  test.each(tests)('Testing key: %s', (testString, expectedString) => {
    expect(parseHeader(testString)).toBe(expectedString)
  })
})

test('valueOrDefault(), should return the default on undefined', () => {
  expect(valueOrDefault(undefined, 'default')).toBe('default')
  expect(valueOrDefault(1, 100)).toBe(1)
})

describe('columnObject(), should return a well defined column object', () => {
  const properties = ['key', 'text', 'invisible', 'sortable', 'filterable']
  const column = columnObject('columnKey')
  const columns = Object.keys(column)

  test.each(properties)(
    `Testing %s in ${JSON.stringify(columns)}`,
    (property) => {
      expect(column).toHaveProperty(property)
    },
  )

  test(`Testing foo not in ${JSON.stringify(columns)}`, () => {
    expect(column).not.toHaveProperty('foo')
  })
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
      isImg: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'avatar',
      text: 'Avatar',
      invisible: false,
      isImg: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'fullName',
      text: 'Full Name',
      invisible: false,
      isImg: false,
      sortable: true,
      filterable: true,
    },
    {
      key: '_username',
      text: 'Username',
      invisible: false,
      isImg: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'password_',
      text: 'Password',
      invisible: false,
      isImg: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'email.address',
      text: 'Email Address',
      invisible: false,
      isImg: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'phone_number',
      text: 'Phone Number',
      invisible: false,
      isImg: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'address.city',
      text: 'Address City',
      invisible: false,
      isImg: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'address.state',
      text: 'Address State',
      invisible: false,
      isImg: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'address.country',
      text: 'Address Country',
      invisible: false,
      isImg: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'url',
      text: 'Url',
      invisible: false,
      isImg: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'isMarried',
      text: 'Is Married',
      invisible: false,
      isImg: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'actions',
      text: 'Actions',
      invisible: false,
      isImg: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'one.0.two.1.three.99.fromArray',
      text: 'One Two Three From Array',
      invisible: false,
      isImg: false,
      sortable: true,
      filterable: true,
    },
    {
      key: 'last_1k_p99_requests',
      text: 'Last 1K P99 Requests',
      invisible: false,
      isImg: false,
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
  ] as UnknownObject<unknown>[]
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
  ] as UnknownObject<unknown>[]
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
  const allKeys = originalData.reduce(
    (acc: string[], curr) => [...acc, ...Object.keys(curr)],
    [],
  )
  const opts: Headers<unknown> = Object.fromEntries(
    allKeys.map((key) => [
      key,
      {
        filterable: true,
        invisible: false,
        isImg: false,
        key: 'name',
        sortable: false,
        text: 'Name',
      },
    ]),
  )
  expect(filterRowsByValue(search, originalData, opts)).toEqual(filteredData)
})

test('sliceRowsPerPage(), should return a properly sized array', () => {
  const N = getRandomInt(100)
  const data = Array(N).fill({}) as UnknownObject<unknown>[]
  const currentPage = 1
  const perPage = [10, 25, 50, 100][getRandomInt(4)]
  const slicedData = sliceRowsPerPage(data, currentPage, perPage)
  expect(Array.isArray(slicedData)).toBe(true)
  expect(slicedData).toHaveLength(Math.min(N, perPage))
})

test('sortData(), should return a properly sorted array', () => {
  type Data = {
    name: string
  }
  const filter = ''
  const opts: Headers<Data> = {
    name: {
      filterable: false,
      invisible: false,
      isImg: false,
      key: 'name',
      sortable: false,
      text: 'Name',
    },
  }
  const customSortOpts: Headers<Data> = {
    name: {
      ...opts.name,
      sortable: (a, b) => a.name.length - b.name.length,
    },
  }
  const sorting: Sorting = { key: 'name', dir: 'ASC' }
  const data = [
    { name: 'john' },
    { name: 'benedict' },
    { name: 'peter' },
    { name: 'ana' },
    { name: 'yasmin' },
  ]
  const sortedDataAsc = [
    { name: 'ana' },
    { name: 'benedict' },
    { name: 'john' },
    { name: 'peter' },
    { name: 'yasmin' },
  ]
  const sortedDataCustom = [
    { name: 'benedict' },
    { name: 'yasmin' },
    { name: 'peter' },
    { name: 'john' },
    { name: 'ana' },
  ]
  const sortedDataDesc = [...sortedDataAsc].reverse()
  expect(sortData(filter, opts, sorting, data)).toEqual(sortedDataAsc)
  sorting.dir = 'DESC'
  expect(sortData(filter, opts, sorting, data)).toEqual(sortedDataDesc)
  expect(sortData(filter, customSortOpts, sorting, data)).toEqual(
    sortedDataCustom,
  )
})

describe('isDataURL(), should return true if data is an enconded image', () => {
  const tests: [unknown, boolean][] = [...negativeImgTests, [imgb64, true]]

  test.each(tests)('Testing data type %#', (data, expected) => {
    expect(isDataURL(data)).toBe(expected)
  })
})

describe('isImage(), should return true if string is an image url', () => {
  const tests: [unknown, boolean][] = [
    ...negativeImgTests,
    ['https://domain.ext/path/to/image.jpg', true],
  ]

  test.each(tests)('Testing data type %#', (data, expected) => {
    expect(isImage(data)).toBe(expected)
  })
})

describe('highlightValueParts(), should return an object of split parts', () => {
  const tests: [[string, string], Highlight][] = [
    [
      ['', ''],
      {
        first: undefined,
        highlight: undefined,
        last: undefined,
        value: '',
      },
    ],
    [
      ['value', ''],
      {
        first: undefined,
        highlight: undefined,
        last: undefined,
        value: 'value',
      },
    ],
    [
      ['value', 'zero'],
      {
        first: undefined,
        highlight: undefined,
        last: undefined,
        value: 'value',
      },
    ],
    [
      ['thisisaverybigword', 'very'],
      {
        first: 'thisisa',
        highlight: 'very',
        last: 'bigword',
        value: 'thisisaverybigword',
      },
    ],
  ]

  test.each(tests)('Testing case %#', (data, expected) => {
    expect(highlightValueParts(...data)).toEqual(expected)
  })
})

describe('getRenderValue(), should decide which value to render', () => {
  const parseBool = {
    noWord: 'No',
    yesWord: 'Yes',
  }
  const tests: [string, RenderOptions, string][] = [
    ['empty', {}, ''],
    ['boolean (true)', { content: true }, 'true'],
    ['boolean (false)', { children: false }, 'false'],
    [
      'parse boolean (true)',
      { children: true, parseBool: true },
      DEFAULT_YES_WORD,
    ],
    [
      'parse boolean (false)',
      { content: false, parseBool: true },
      DEFAULT_NO_WORD,
    ],
    ['custom boolean (true)', { children: true, parseBool }, parseBool.yesWord],
    ['custom boolean (false)', { content: false, parseBool }, parseBool.noWord],
    ['number (0)', { content: 0 }, '0'],
    ['number (11)', { children: 11 }, '11'],
    ['string (hello)', { content: 'hello' }, 'hello'],
    ['array ([])', { content: [] }, ''],
    ['array ([1])', { content: [1] }, '1'],
    ["array ([1, 'a'])", { children: [1, 'a'] }, '1,a'],
    ['object ({})', { content: {} as ReactNode }, '[object Object]'],
  ]

  test.each(tests)('Testing %s', (name, data, expected) => {
    expect(getRenderValue(data)).toBe(expected)
  })
})

describe('getSampleElement(), should sample the data and return a proper example', () => {
  const testCases = [
    {
      gender: 'female',
      name: {
        first: 'Mileah',
      },
      email: 'mileah.tandstad@example.com',
      cell: '48243014',
      id: {
        value: '17015102098',
      },
      picture: {
        thumbnail: 'https://randomuser.me/api/portraits/thumb/women/43.jpg',
      },
    },
    {
      name: {
        first: 'Mileah',
      },
      location: {
        street: {
          name: 'Engveien',
        },
        city: 'Vanvikan',
        state: 'Sør-Trøndelag',
        country: 'Norway',
        postcode: '4006',
      },
      email: 'mileah.tandstad@example.com',
      cell: '48243014',
      id: {
        value: '17015102098',
      },
      picture: {
        thumbnail: 'https://randomuser.me/api/portraits/thumb/women/43.jpg',
      },
    },
    {
      name: {
        first: 'Mileah',
      },
      location: {
        street: {
          name: 'Engveien',
        },
        city: 'Vanvikan',
        state: 'Sør-Trøndelag',
        country: 'Norway',
        postcode: '4006',
      },
      phone: '74670178',
      cell: '48243014',
      id: {
        value: '17015102098',
      },
      picture: {
        thumbnail: 'https://randomuser.me/api/portraits/thumb/women/43.jpg',
      },
    },
  ].flatMap((row) =>
    Array.from(Array(10) as unknown[]).fill(row),
  ) as UnknownObject<unknown>[]
  const inputOutput = [
    [
      0,
      {
        gender: 'female',
        'name.first': 'Mileah',
        email: 'mileah.tandstad@example.com',
        cell: '48243014',
        'id.value': '17015102098',
        'picture.thumbnail':
          'https://randomuser.me/api/portraits/thumb/women/43.jpg',
      },
    ],
    [
      1,
      {
        gender: 'female',
        'name.first': 'Mileah',
        email: 'mileah.tandstad@example.com',
        cell: '48243014',
        'id.value': '17015102098',
        'picture.thumbnail':
          'https://randomuser.me/api/portraits/thumb/women/43.jpg',
      },
    ],
    [
      10,
      {
        gender: 'female',
        'name.first': 'Mileah',
        email: 'mileah.tandstad@example.com',
        cell: '48243014',
        'id.value': '17015102098',
        'picture.thumbnail':
          'https://randomuser.me/api/portraits/thumb/women/43.jpg',
      },
    ],
    [
      25,
      {
        gender: 'female',
        'name.first': 'Mileah',
        email: 'mileah.tandstad@example.com',
        cell: '48243014',
        'id.value': '17015102098',
        'picture.thumbnail':
          'https://randomuser.me/api/portraits/thumb/women/43.jpg',
      },
    ],
    [
      50,
      {
        gender: 'female',
        'name.first': 'Mileah',
        email: 'mileah.tandstad@example.com',
        cell: '48243014',
        'id.value': '17015102098',
        'picture.thumbnail':
          'https://randomuser.me/api/portraits/thumb/women/43.jpg',
        'location.city': 'Vanvikan',
        'location.country': 'Norway',
        'location.postcode': '4006',
        'location.state': 'Sør-Trøndelag',
        'location.street.name': 'Engveien',
      },
    ],
    [
      75,
      {
        gender: 'female',
        'name.first': 'Mileah',
        email: 'mileah.tandstad@example.com',
        phone: '74670178',
        cell: '48243014',
        'id.value': '17015102098',
        'picture.thumbnail':
          'https://randomuser.me/api/portraits/thumb/women/43.jpg',
        'location.city': 'Vanvikan',
        'location.country': 'Norway',
        'location.postcode': '4006',
        'location.state': 'Sør-Trøndelag',
        'location.street.name': 'Engveien',
      },
    ],
    [
      100,
      {
        gender: 'female',
        'name.first': 'Mileah',
        email: 'mileah.tandstad@example.com',
        phone: '74670178',
        cell: '48243014',
        'id.value': '17015102098',
        'picture.thumbnail':
          'https://randomuser.me/api/portraits/thumb/women/43.jpg',
        'location.city': 'Vanvikan',
        'location.country': 'Norway',
        'location.postcode': '4006',
        'location.state': 'Sør-Trøndelag',
        'location.street.name': 'Engveien',
      },
    ],
  ] as [number, UnknownObject<unknown>][]
  const tests = inputOutput.map(([dataSampling, output]) => [
    `Data Sampling: ${JSON.stringify(dataSampling)}%`,
    testCases,
    dataSampling,
    output,
  ])

  test.each(tests)('Testing %s', (name, data, dataSampling, expected) => {
    expect(
      getSampleElement(
        data as UnknownObject<unknown>[],
        dataSampling as number,
      ),
    ).toEqual(expected)
  })

  test('Throws an error if the dataSampling is outside [0, 100]', () => {
    expect(() => {
      getSampleElement(testCases, -1)
    }).toThrow()

    expect(() => {
      getSampleElement(testCases, 101)
    }).toThrow()
  })
})
