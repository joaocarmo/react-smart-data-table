// Import modules
import flatten from 'flat'
import memoizeOne from 'memoize-one'
import escapeStringRegexp from 'escape-string-regexp'
import { snakeCase } from 'snake-case'
import fileImgExtensions from './file-extensions'

// Lodash alternatives

const head = ([first]) => first

const tail = ([...arr]) => arr.pop()

const isString = (str) => typeof str === 'string' || str instanceof String

const isArray = (obj) => Array.isArray(obj)

const isObject = (obj) =>
  (obj && typeof obj === 'object' && obj.constructor === Object) || false

const isEmpty = (obj) => {
  if (isArray(obj)) return !obj.length
  if (isObject(obj)) return !Object.keys(obj).length
  return false
}

const isFunction = (fn) => typeof fn === 'function'

const isNumber = (num) => typeof num === 'number' && Number.isFinite(num)

const isUndefined = (undef) => typeof undef === 'undefined'

const capitalize = (str) => {
  if (isString(str)) {
    const regex = /[^a-z]*[a-z]/
    const [first = ''] = str.match(regex)
    return first.toUpperCase() + str.substring(first.length)
  }
  return ''
}

const sortBy = (arr, key) =>
  [...arr].sort((a, b) => {
    if (a[key] > b[key]) return 1
    if (b[key] > a[key]) return -1
    return 0
  })

const cleanLonelyInt = (val) => !(val && /^\d+$/.test(val))

// Custom functions

export function debugPrint(...args) {
  if (process.env.NODE_ENV !== 'production') {
    /* eslint-disable no-console */
    console.log(...args)
  }
}

export function errorPrint(...args) {
  /* eslint-disable no-console */
  console.error(...args)
}

export function generatePagination(activePage = 1, totalPages = 1, margin = 1) {
  const previousPage = activePage - 1 > 0 ? activePage - 1 : 1
  const nextPage = activePage + 1 > totalPages ? totalPages : activePage + 1
  const gap = 1 + 2 * margin
  const numPagesShow = 2 + gap
  const pagination = [
    { active: false, value: 1, text: '<<' },
    { active: false, value: previousPage, text: '<' },
  ]
  if (totalPages > numPagesShow) {
    if (activePage >= gap) {
      pagination.push({ active: false, value: 1, text: '1' })
      if (activePage > gap) {
        pagination.push({
          active: false,
          value: undefined,
          text: '...',
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
          text: '...',
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
  pagination.push({ active: false, value: nextPage, text: '>' })
  pagination.push({ active: false, value: totalPages, text: '>>' })
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

export function fetchData(data, key = 'data') {
  return new Promise((resolve, reject) => {
    if (isArray(data)) {
      resolve(data)
    } else if (isString(data)) {
      fetch(data)
        .then((response) => {
          const { ok, status, statusText } = response
          if (ok || status === 200 || statusText === 'OK') {
            return response.json()
          }
          reject(new Error(`${status} - ${statusText}`))
          return undefined
        })
        .then((json) => {
          resolve(key ? json[key] : json)
        })
        .catch((reason) => reject(reason))
    } else {
      reject(new Error('data type is invalid'))
    }
  })
}

export function capitalizeAll(arr) {
  return arr.map(capitalize).join(' ').trim()
}

const memoizedCapitalizeAll = memoizeOne(capitalizeAll)

export function parseHeader(val) {
  if (isString(val)) {
    const toSnakeCase = snakeCase(val)
    return memoizedCapitalizeAll(toSnakeCase.split('_').filter(cleanLonelyInt))
  }
  return []
}

export function valueOrDefault(value, dfault) {
  if (isUndefined(value)) return dfault
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

const memoizedFilterRowsByValue = memoizeOne(filterRowsByValue)

export function filterRows(value, rows, colProperties) {
  if (!value) return rows
  return memoizedFilterRowsByValue(value, rows, colProperties)
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
  if (last !== -1) pathname = pathname.substring(0, last)
  const ext = pathname.split('.').pop().toLowerCase()
  return fileImgExtensions.includes(ext)
}

const memoizeIsImage = memoizeOne(isImage)

export function highlightValueParts(value, filterValue) {
  if (!filterValue) return value
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

const memoizedHighlightValueParts = memoizeOne(highlightValueParts)

// Export Memoizations

export { memoizedCapitalizeAll, memoizeIsImage, memoizedHighlightValueParts }

// Export Lodash alternatives

export {
  head,
  tail,
  isString,
  isArray,
  isObject,
  isEmpty,
  isFunction,
  isNumber,
  isUndefined,
}
