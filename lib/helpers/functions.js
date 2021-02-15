import flatten from 'flat'
import escapeStringRegexp from 'escape-string-regexp'
import { snakeCase } from 'snake-case'
import fileImgExtensions from './file-extensions'
import {
  DEFAULT_DATA_KEY,
  DEFAULT_NO_WORD,
  DEFAULT_YES_WORD,
  ERROR_INVALID_DATA,
  ERROR_INVALID_RESPONSE,
  PAGINATION_ELLIPSIS,
  PAGINATION_FIRST,
  PAGINATION_LAST,
  PAGINATION_NEXT,
  PAGINATION_PREVIOUS,
  STR_FALSE,
  STR_ZERO,
} from './constants'

export const head = ([first]) => first

export const tail = ([...arr]) => arr.pop()

export const isString = (str) =>
  typeof str === 'string' || str instanceof String

export const isArray = (obj) => Array.isArray(obj)

export const isObject = (obj) =>
  (obj && typeof obj === 'object' && obj.constructor === Object) || false

export const isEmpty = (obj) => {
  if (isArray(obj)) {
    return !obj.length
  }

  if (isObject(obj)) {
    return !Object.keys(obj).length
  }

  return false
}

export const isFunction = (fn) => typeof fn === 'function'

export const isNumber = (num) => typeof num === 'number' && Number.isFinite(num)

export const isUndefined = (undef) => typeof undef === 'undefined'

export const capitalize = (str) => {
  if (isString(str)) {
    const regex = /[^a-z]*[a-z]/
    const [first = ''] = str.match(regex)

    return first.toUpperCase() + str.substring(first.length)
  }

  return ''
}

export const sortBy = (arr, key) =>
  [...arr].sort((a, b) => {
    if (a[key] > b[key]) {
      return 1
    }

    if (b[key] > a[key]) {
      return -1
    }

    return 0
  })

export const cleanLonelyInt = (val) => !(val && /^\d+$/.test(val))

export const debugPrint = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    /* eslint-disable no-console */
    console.log(...args)
  }
}

export const errorPrint = (...args) => {
  /* eslint-disable no-console */
  console.error(...args)
}

export function generatePagination(activePage = 1, totalPages = 1, margin = 1) {
  const previousPage = activePage - 1 > 0 ? activePage - 1 : 1
  const nextPage = activePage + 1 > totalPages ? totalPages : activePage + 1
  const gap = 1 + 2 * margin
  const numPagesShow = 2 + gap
  const pagination = [
    { active: false, value: 1, text: PAGINATION_FIRST },
    { active: false, value: previousPage, text: PAGINATION_PREVIOUS },
  ]

  if (totalPages > numPagesShow) {
    if (activePage >= gap) {
      pagination.push({ active: false, value: 1, text: '1' })

      if (activePage > gap) {
        pagination.push({
          active: false,
          value: undefined,
          text: PAGINATION_ELLIPSIS,
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
          text: PAGINATION_ELLIPSIS,
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
  pagination.push({ active: false, value: nextPage, text: PAGINATION_NEXT })
  pagination.push({ active: false, value: totalPages, text: PAGINATION_LAST })

  return pagination
}

export function getNestedObject(nestedObj, pathArr) {
  if (isObject(nestedObj) && !isEmpty(nestedObj)) {
    let path = []

    if (isString(pathArr)) {
      path.push(pathArr)
    } else if (isArray(pathArr)) {
      path = pathArr
    }

    const reducerFn = (obj, key) =>
      obj && !isUndefined(obj[key]) ? obj[key] : undefined

    return path.reduce(reducerFn, nestedObj)
  }

  return undefined
}

export async function fetchData(data, key = DEFAULT_DATA_KEY) {
  if (isArray(data)) {
    return data
  }

  if (isString(data)) {
    const response = await fetch(data)

    const { headers, ok, status, statusText } = response

    if (ok || status === 200 || statusText === 'OK') {
      const contentType = headers.get('content-type')

      if (contentType && contentType.includes('application/json')) {
        const jsonBody = await response.json()

        return key ? jsonBody[key] : jsonBody
      }

      throw new Error(ERROR_INVALID_RESPONSE)
    }

    throw new Error(`${status} - ${statusText}`)
  } else {
    throw new Error(ERROR_INVALID_DATA)
  }
}

export function capitalizeAll(arr) {
  return arr.map(capitalize).join(' ').trim()
}

export function parseHeader(val) {
  if (isString(val)) {
    const toSnakeCase = snakeCase(val)

    return capitalizeAll(toSnakeCase.split('_').filter(cleanLonelyInt))
  }

  return []
}

export function valueOrDefault(value, defaultValue) {
  if (isUndefined(value)) {
    return defaultValue
  }

  return value
}

export function columnObject(key, headers = {}) {
  const { text, invisible, sortable, filterable } = { ...headers[key] }

  return {
    key,
    text: valueOrDefault(text, parseHeader(key)),
    invisible: valueOrDefault(invisible, false),
    sortable: valueOrDefault(sortable, true),
    filterable: valueOrDefault(filterable, true),
  }
}

export function parseDataForColumns(
  data = [],
  headers = {},
  orderedHeaders = [],
  hideUnordered = false,
) {
  const columnsAdded = []
  const columns = []

  if (data && isArray(data) && !isEmpty(data)) {
    const filteredData = data.filter((row) => !!row)
    const firstElement = flatten(head(filteredData))

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
    if (!hideUnordered && isObject(firstElement)) {
      const headKeys = Object.keys(firstElement)

      for (let i = 0, N = headKeys.length; i < N; i += 1) {
        const key = headKeys[i]

        if (!columnsAdded.includes(key)) {
          columns.push(columnObject(key, headers))
        }
      }
    }
  }

  return columns
}

export function parseDataForRows(data = []) {
  let rows = []

  if (data && isArray(data) && !isEmpty(data)) {
    const filteredData = data.filter((row) => isObject(row) && !isEmpty(row))
    rows = filteredData.map((row) => flatten(row))
  }

  return rows
}

export function filterRowsByValue(value, rows, colProperties) {
  return rows.filter((row) => {
    const regex = new RegExp(`.*?${escapeStringRegexp(value)}.*?`, 'i')
    let hasMatch = false
    const rowKeys = Object.keys(row)

    for (let i = 0, N = rowKeys.length; i < N; i += 1) {
      const key = rowKeys[i]
      const val = row[key]
      const colProps = { ...colProperties[key] }

      if (colProps.filterable !== false) {
        hasMatch = hasMatch || regex.test(val)
      }
    }

    return hasMatch
  })
}

export function filterRows(value, rows, colProperties) {
  if (!value) {
    return rows
  }

  return filterRowsByValue(value, rows, colProperties)
}

export function sliceRowsPerPage(rows, currentPage, perPage) {
  if (isNumber(perPage) && Math.sign(perPage)) {
    const start = perPage * (currentPage - 1)
    const end = perPage * currentPage

    return rows.slice(start, end)
  }

  return rows
}

export function sortData(filterValue, colProperties, sorting, data) {
  let sortedRows = []
  const { dir, key } = sorting

  if (dir) {
    if (dir === 'ASC') {
      sortedRows = sortBy(data, [key])
    } else {
      sortedRows = sortBy(data, [key]).reverse()
    }
  } else {
    sortedRows = data.slice(0)
  }

  return filterRows(filterValue, sortedRows, colProperties)
}

export function isDataURL(url) {
  // Checks if the data is a valid base64 enconded string
  const regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/

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

export function isImage(url) {
  const isImgDataURL = isDataURL(url)

  if (isImgDataURL) {
    return isImgDataURL
  }

  const parser = document.createElement('a')
  parser.href = url
  let { pathname } = parser
  const last = pathname.search(/[:?&#]/)

  if (last !== -1) {
    pathname = pathname.substring(0, last)
  }

  const ext = pathname.split('.').pop().toLowerCase()

  return fileImgExtensions.includes(ext)
}

export function highlightValueParts(value, filterValue) {
  if (!filterValue) {
    return value
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

  return {
    first: undefined,
    highlight: undefined,
    last: undefined,
    value,
  }
}

export const getRenderValue = ({ children, content, parseBool } = {}) => {
  if (parseBool) {
    const { yesWord, noWord } = parseBool

    if (content === true || children === true) {
      return yesWord || DEFAULT_YES_WORD
    }

    if (content === false || children === false) {
      return noWord || DEFAULT_NO_WORD
    }
  }

  if (content === 0 || children === 0) {
    return STR_ZERO
  }

  if (content === false || children === false) {
    return STR_FALSE
  }

  let value = ''

  if (content) {
    value = content
  } else if (children) {
    value = children
  }

  return `${value}`
}
