import { CSSProperties, MouseEvent, ReactNode } from 'react'
import flatten from 'flat'
import escapeStringRegexp from 'escape-string-regexp'
import { snakeCase } from 'change-case'
import fileImgExtensions from './file-extensions'
import * as constants from './constants'

export type UnknownObject<T = unknown> = Record<string, T>

export type ParseBool = {
  noWord: string
  yesWord: string
}

export type ParseImg = {
  style: CSSProperties
  className: string
}

export type TransformFN<T = UnknownObject> = (
  value: unknown,
  index: number,
  row: T,
) => ReactNode

export type RowClickFN<T = UnknownObject> = (
  event: MouseEvent<HTMLElement>,
  {
    rowData,
    rowIndex,
    tableData,
  }: { rowData: T; rowIndex: number; tableData: T[] },
) => void

export type CompareFunction<T> = (a: T, b: T) => number

export type HeaderSortable<T> = boolean | CompareFunction<T>

export interface Column<T> {
  key: string
  text: string
  invisible: boolean
  sortable: HeaderSortable<T>
  filterable: boolean
  isImg: boolean
  transform?: TransformFN<T>
}

export type Headers<T> = Record<string, Column<T>>

export type Sorting = {
  key: string
  dir: string
}

export interface Highlight {
  first: string | undefined
  highlight: string | undefined
  last: string | undefined
  value: string
}

export interface RenderOptions {
  children?: ReactNode
  content?: ReactNode
  parseBool?: boolean | ParseBool
}

export type KeyResolverFN<T = UnknownObject> = (args: T) => T[]

export interface FetchDataOptions<T = UnknownObject> {
  dataKey?: string
  dataKeyResolver?: KeyResolverFN<T>
  options?: RequestInit
}

export const head = <T>([first]: T[]): T => first

export const tail = <T>(arr: T[]): T => arr[arr.length - 1]

export const isString = (str: unknown): boolean =>
  typeof str === 'string' || str instanceof String

export const isArray = <T = unknown>(obj: T): boolean => Array.isArray(obj)

export const isObject = <T = unknown>(obj: T): boolean =>
  (obj && typeof obj === 'object' && obj.constructor === Object) || false

export const isEmpty = <T = UnknownObject>(obj: unknown[] | T): boolean => {
  if (Array.isArray(obj) && 'length' in obj) {
    return !obj.length
  }

  if (isObject(obj)) {
    return !Object.keys(obj).length
  }

  return false
}

export const isFunction = (fn: (...args: unknown[]) => unknown): boolean =>
  typeof fn === 'function'

export const isNumber = <T = unknown>(num: T): boolean =>
  typeof num === 'number' && Number.isFinite(num)

export const isUndefined = <T = unknown>(undef: T): boolean =>
  typeof undef === 'undefined'

export const capitalize = (str: string): string => {
  if (isString(str)) {
    const regex = /[^a-z]*[a-z]/
    const [first = ''] = regex.exec(str)

    return first.toUpperCase() + str.substring(first.length)
  }

  return ''
}

export const sortBy = <T = UnknownObject>(
  arr: T[],
  key: string,
  compareFn: HeaderSortable<T>,
): T[] => {
  const defaultSort: CompareFunction<T> = (a, b) => {
    if (a[key] > b[key]) {
      return 1
    }

    if (b[key] > a[key]) {
      return -1
    }

    return 0
  }

  const sortFn = typeof compareFn === 'function' ? compareFn : defaultSort

  return [...arr].sort(sortFn)
}

export const cleanLonelyInt = (val: string): boolean =>
  !(val && /^\d+$/.test(val))

export const debugPrint = (...args: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args)
  }
}

export const errorPrint = (...args: unknown[]): void => {
  console.error(...args)
}

export function generatePagination(
  activePage = 1,
  totalPages = 1,
  margin = 1,
): {
  active: boolean
  value: number | undefined
  text: string
}[] {
  const previousPage = activePage - 1 > 0 ? activePage - 1 : 1
  const nextPage = activePage + 1 > totalPages ? totalPages : activePage + 1
  const gap = 1 + 2 * margin
  const numPagesShow = 2 + gap
  const pagination = [
    { active: false, value: 1, text: constants.PAGINATION_FIRST },
    { active: false, value: previousPage, text: constants.PAGINATION_PREVIOUS },
  ]

  if (totalPages > numPagesShow) {
    if (activePage >= gap) {
      pagination.push({ active: false, value: 1, text: '1' })

      if (activePage > gap) {
        pagination.push({
          active: false,
          value: undefined,
          text: constants.PAGINATION_ELLIPSIS,
        })
      }
    }

    for (let i = -margin; i < 2 * margin; i += 1) {
      const page = activePage + i

      if (page > 0 && page <= totalPages) {
        pagination.push({
          active: activePage === page,
          value: page,
          text: `${page}`,
        })
      }
    }

    if (totalPages - activePage > margin) {
      if (totalPages - activePage - 1 > margin) {
        pagination.push({
          active: false,
          value: undefined,
          text: constants.PAGINATION_ELLIPSIS,
        })
      }

      pagination.push({
        active: false,
        value: totalPages,
        text: `${totalPages}`,
      })
    }
  } else {
    for (let i = 1; i <= totalPages; i += 1) {
      pagination.push({
        active: activePage === i,
        value: i,
        text: `${i}`,
      })
    }
  }
  pagination.push({
    active: false,
    value: nextPage,
    text: constants.PAGINATION_NEXT,
  })
  pagination.push({
    active: false,
    value: totalPages,
    text: constants.PAGINATION_LAST,
  })

  return pagination
}

export function getNestedObject<T = UnknownObject>(
  nestedObj: T,
  pathArr: string[],
): unknown {
  if (isObject(nestedObj) && !isEmpty(nestedObj)) {
    let path = []

    if (isString(pathArr)) {
      path.push(pathArr)
    } else if (isArray(pathArr)) {
      path = pathArr
    }

    const reducerFn = (obj: T, key: string): unknown =>
      obj && !isUndefined(obj[key]) ? obj[key] : undefined

    return path.reduce(reducerFn, nestedObj)
  }

  return undefined
}

export async function fetchData<T = UnknownObject>(
  data: string | unknown[],
  {
    dataKey = constants.DEFAULT_DATA_KEY,
    dataKeyResolver,
    options = {},
  }: FetchDataOptions<T> = {},
): Promise<T[]> {
  if (isArray(data)) {
    return data as T[]
  }

  if (isString(data)) {
    const response = await fetch(data as string, options)

    const { headers, ok, status, statusText } = response

    if (ok) {
      const contentType = headers.get('content-type')

      if (contentType && contentType.includes('application/json')) {
        const jsonBody = (await response.json()) as T

        if (typeof dataKeyResolver === 'function') {
          return dataKeyResolver(jsonBody)
        }

        return (dataKey ? jsonBody[dataKey] : jsonBody) as T[]
      }

      throw new Error(constants.ERROR_INVALID_RESPONSE)
    }

    throw new Error(`${status} - ${statusText}`)
  } else {
    throw new Error(constants.ERROR_INVALID_DATA)
  }
}

export function capitalizeAll(arr: string[]): string {
  return arr.map(capitalize).join(' ').trim()
}

export function parseHeader(val: string): string {
  if (isString(val)) {
    const toSnakeCase = snakeCase(val)

    return capitalizeAll(toSnakeCase.split('_').filter(cleanLonelyInt))
  }

  return ''
}

export function valueOrDefault<T = unknown>(value: T, defaultValue: T): T {
  if (isUndefined(value)) {
    return defaultValue
  }

  return value
}

export function columnObject<T>(
  key: string,
  headers: Headers<T> = {},
): Column<T> {
  const { text, invisible, sortable, filterable } = { ...headers[key] }

  return {
    key,
    text: valueOrDefault(text, parseHeader(key)),
    invisible: valueOrDefault(invisible, false),
    sortable: valueOrDefault(sortable, true),
    filterable: valueOrDefault(filterable, true),
    isImg: valueOrDefault(invisible, false),
  }
}

export function getSampleElement<T = UnknownObject>(
  data: T[] = [],
  dataSampling = 0,
): T {
  if (!dataSampling) {
    return flatten<T, T>(head<T>(data))
  }

  if (dataSampling < 0 || dataSampling > 100) {
    throw new Error(constants.ERROR_INVALID_SAMPLING_RANGE)
  }

  const sampleElement = data
    .slice(0, Math.ceil((dataSampling / 100) * data.length))
    .reduce<T>((merged, row) => ({ ...merged, ...row }), {} as T)

  return flatten<T, T>(sampleElement)
}

export function parseDataForColumns<T = UnknownObject>(
  data: T[] = [],
  headers: Headers<T> = {},
  orderedHeaders: string[] = [],
  hideUnordered = false,
  dataSampling = 0,
): Column<T>[] {
  const columnsAdded: string[] = []
  const columns: Column<T>[] = []

  if (data && isArray(data) && !isEmpty(data)) {
    // Clear falsy values from the data
    const filteredData = data.filter((row) => !!row)
    // Get a non-empty sample value from the data
    const sampleElement = getSampleElement(filteredData, dataSampling)

    // First, attach the ordered headers
    if (!isEmpty(orderedHeaders)) {
      orderedHeaders.forEach((key) => {
        if (!columnsAdded.includes(key)) {
          columns.push(columnObject(key, headers))
          columnsAdded.push(key)
        }
      })
    }

    // Then, add all the remaining headers
    if (!hideUnordered && isObject(sampleElement)) {
      const headKeys = [...Object.keys(sampleElement), ...Object.keys(headers)]

      for (const key of headKeys) {
        if (!columnsAdded.includes(key)) {
          columns.push(columnObject(key, headers))
          columnsAdded.push(key)
        }
      }
    }
  }

  return columns
}

export function parseDataForRows<T = UnknownObject>(data: T[] = []): T[] {
  let rows: T[] = []

  if (data && isArray(data) && !isEmpty(data)) {
    const filteredData = data.filter((row) => isObject(row) && !isEmpty(row))
    rows = filteredData.map((row) => flatten(row))
  }

  return rows
}

export function filterRowsByValue<T = UnknownObject>(
  value: string,
  rows: T[],
  colProperties: Headers<T>,
): T[] {
  return rows.filter((row) => {
    const regex = new RegExp(`.*?${escapeStringRegexp(value)}.*?`, 'i')
    let hasMatch = false
    const rowKeys = Object.keys(row)

    for (let i = 0, N = rowKeys.length; i < N; i += 1) {
      const key = rowKeys[i]
      const val = row[key] as string
      const colProps = { ...colProperties[key] }

      if (colProps.filterable !== false) {
        hasMatch = hasMatch || regex.test(val)
      }
    }

    return hasMatch
  })
}

export function filterRows<T = UnknownObject>(
  value: string,
  rows: T[],
  colProperties: Headers<T>,
): T[] {
  if (!value) {
    return rows
  }

  return filterRowsByValue(value, rows, colProperties)
}

export function sliceRowsPerPage<T = UnknownObject>(
  rows: T[],
  currentPage: number,
  perPage: number,
): T[] {
  if (isNumber(perPage) && Math.sign(perPage)) {
    const start = perPage * (currentPage - 1)
    const end = perPage * currentPage

    return rows.slice(start, end)
  }

  return rows
}

export function sortData<T = UnknownObject>(
  filterValue: string,
  colProperties: Headers<T>,
  sorting: Sorting,
  data: T[],
): T[] {
  let sortedRows: T[] = []
  const { dir, key } = sorting
  const compareFn =
    typeof colProperties[key]?.sortable === 'function' &&
    colProperties[key].sortable

  if (dir) {
    if (dir === 'ASC') {
      sortedRows = sortBy(data, key, compareFn)
    } else {
      sortedRows = sortBy(data, key, compareFn).reverse()
    }
  } else {
    sortedRows = data.slice(0)
  }

  return filterRows(filterValue, sortedRows, colProperties)
}

export function isDataURL(url: unknown): boolean {
  // Checks if the data is a valid base64 enconded string
  const regex =
    /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/

  if (typeof url === 'string') {
    const [initData, restData] = url.split(':')

    if (initData && initData === 'data') {
      if (restData) {
        const [mediaType, b64Data] = restData.split(';')

        if (mediaType) {
          const [mimeType, mimeSubTypes] = mediaType.split('/')
          const [mimeSubType] = mimeSubTypes.split('+')

          if (mimeType === 'image' && typeof mimeSubType === 'string') {
            if (b64Data) {
              const [type, imgData] = b64Data.split(',')

              if (type === 'base64' && regex.test(imgData)) {
                return fileImgExtensions.includes(mimeSubType.toLowerCase())
              }
            }
          }
        }
      }
    }
  }

  return false
}

export function isImage(url: unknown): boolean {
  const isImgDataURL = isDataURL(url)

  if (isImgDataURL) {
    return isImgDataURL
  }

  const parser = document.createElement('a')
  parser.href = String(url)
  let { pathname } = parser
  const last = pathname.search(/[:?&#]/)

  if (last !== -1) {
    pathname = pathname.substring(0, last)
  }

  const ext = pathname.split('.').pop().toLowerCase()

  return fileImgExtensions.includes(ext)
}

export function highlightValueParts(
  value: string,
  filterValue: string,
): Highlight {
  const defaultReturn = {
    first: undefined,
    highlight: undefined,
    last: undefined,
    value,
  }

  if (!filterValue) {
    return defaultReturn
  }

  const regex = new RegExp(`.*?${escapeStringRegexp(filterValue)}.*?`, 'i')

  if (regex.test(value)) {
    const splitStr = value.toLowerCase().split(filterValue.toLowerCase())
    const nFirst = head(splitStr).length
    const nHighlight = filterValue.length
    const first = value.substring(0, nFirst)
    const highlight = value.substring(nFirst, nFirst + nHighlight)
    const last = value.substring(nFirst + nHighlight)

    return {
      first,
      highlight,
      last,
      value,
    }
  }

  return defaultReturn
}

export function getRenderValue({
  children,
  content,
  parseBool,
}: RenderOptions = {}): string {
  if (parseBool) {
    const {
      noWord = constants.DEFAULT_NO_WORD,
      yesWord = constants.DEFAULT_YES_WORD,
    } = typeof parseBool === 'object' ? parseBool : {}

    if (content === true || children === true) {
      return yesWord
    }

    if (content === false || children === false) {
      return noWord
    }
  }

  if (content === 0 || children === 0) {
    return constants.STR_ZERO
  }

  if (content === false || children === false) {
    return constants.STR_FALSE
  }

  let value = ''

  if (content) {
    value = content as string
  } else if (children) {
    value = children as string
  }

  return `${value}`
}
