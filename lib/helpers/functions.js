// Import modules
import flatten from 'flat'
import memoizeOne from 'memoize-one'
import capitalize from 'lodash/capitalize'
import isString from 'lodash/isString'
import camelCase from 'lodash/camelCase'
import filter from 'lodash/filter'
import forOwn from 'lodash/forOwn'
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import isPlainObject from 'lodash/isPlainObject'
import sortBy from 'lodash/sortBy'
import reverse from 'lodash/reverse'
import fileImgExtensions from './file-extensions'

export function debugPrint(...args) {
  console.log(...args)
}

export function errorPrint(...args) {
  console.error(...args)
}

export function fetchData(data, key = 'data') {
  return new Promise((resolve, reject) => {
    if (isArray(data)) {
      resolve(data)
    } else if (typeof data === 'string') {
      fetch(data).then((response) => {
        if (response.ok
          || response.status === 200
          || response.statusText === 'OK') {
          return response.json()
        }
        reject(new Error(`${response.status} - ${response.statusText} - ${data}`))
      }).then((json) => {
        resolve(key ? json[key] : json)
      }).catch(reason => reject(reason))
    } else {
      reject(new Error('data type is invalid'))
    }
  })
}

export function capitalizeAll(arr) {
  return arr.map(m => (m ? capitalize(m) : '')).join(' ').trim()
}

const memoizedCapitalizeAll = memoizeOne(capitalizeAll)

export function parseHeader(val) {
  if (isString(val)) {
    const toCamelCase = camelCase(val)
    const parser = /^[a-z]+|[A-Z][a-z]*/g
    return memoizedCapitalizeAll(toCamelCase.match(parser))
  }
  return ''
}

export function columnObject(key) {
  return {
    key,
    title: parseHeader(key),
    visible: true,
    sortable: true,
    filterable: true,
  }
}

export function parseDataForColumns(data) {
  const columns = []
  if (data && isArray(data) && !isEmpty(data)) {
    const filteredData = data.filter(row => !!row)
    const firstElemnt = flatten(filteredData[0])
    if (isPlainObject(firstElemnt)) {
      const keys = Object.keys(firstElemnt)
      keys.forEach((key) => {
        columns.push(columnObject(key))
      })
    }
  }
  return columns
}

export function parseDataForRows(data) {
  let rows = []
  if (data && isArray(data) && !isEmpty(data)) {
    const filteredData = data.filter(row => !!row)
    rows = filteredData.map(row => flatten(row))
  }
  return rows
}

const equalityFilterFn = (newArg, lastArg) => {
  if (typeof newArg === 'string') {
    if (newArg === lastArg) {
      return true
    }
    return false
  }
  return true
}

export function filterRowsByValue(value, rows) {
  return filter(rows, (row) => {
    const regex = new RegExp(`.*?${value}.*?`, 'i')
    let hasMatch = false
    forOwn(row, (val) => {
      hasMatch = hasMatch || regex.test(val)
    })
    return hasMatch
  })
}

const memoizedFilterRowsByValue = memoizeOne(filterRowsByValue, equalityFilterFn)

export function filterRows(value, rows, sortingDir) {
  if (!value) return rows
  return memoizedFilterRowsByValue(value, rows, sortingDir)
}

export function sliceRowsPerPage(rows, currentPage, perPage) {
  if (perPage && perPage > 0) {
    const start = perPage * (currentPage - 1)
    const end = perPage * currentPage
    return rows.slice(start, end)
  }
  return rows
}

export function sortData(filterValue, sorting, data) {
  let sortedRows = []
  if (sorting.dir) {
    if (sorting.dir === 'ASC') {
      sortedRows = sortBy(data, [sorting.key])
    } else {
      sortedRows = reverse(sortBy(data, [sorting.key]))
    }
  } else {
    sortedRows = data.slice(0)
  }
  return filterRows(filterValue, sortedRows, sorting.dir)
}

export function isImage(url) {
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
  const regex = new RegExp(`.*?${filterValue}.*?`, 'i')
  if (filterValue && regex.test(value)) {
    const splitStr = value.toLowerCase().split(filterValue.toLowerCase())
    const nFirst = splitStr[0].length
    const nHighlight = filterValue.length
    const first = value.substring(0, nFirst)
    const highlight = value.substring(nFirst, nFirst + nHighlight)
    const last = value.substring(nFirst + nHighlight)
    return {
      first, highlight, last, value,
    }
  }
  return { value }
}

const memoizedHighlightValueParts = memoizeOne(highlightValueParts)

// Export Memoizations

export {
  memoizedCapitalizeAll, memoizeIsImage, memoizedHighlightValueParts,
}
