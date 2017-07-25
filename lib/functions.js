import flatten from 'flat'
import capitalize from 'lodash/capitalize'
import isString from 'lodash/isString'
import camelCase from 'lodash/camelCase'
import filter from 'lodash/filter'
import forOwn from 'lodash/forOwn'
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import isPlainObject from 'lodash/isPlainObject'

export function capitalizeAll(arr) {
  return arr.map(m => m ? capitalize(m) : '').join(' ').trim();
}

export function parseHeader(val) {
  if (isString(val)) {
    const toCamelCase = camelCase(val)
    const parser = /^[a-z]+|[A-Z][a-z]*/g
    return capitalizeAll(toCamelCase.match(parser));
  }
  return '';
}

export function columnObject(key) {
  return {
    key,
    title: parseHeader(key),
    visible: true,
    sortable: true,
    filterable: true
  };
}

export function parseDataForColumns(_data) {
  var columns = []
  if (_data && isArray(_data) && !isEmpty(_data)) {
    const data = _data.filter(row => !!row)
    const firstElemnt = flatten(data[0])
    if (isPlainObject(firstElemnt)) {
      const keys = Object.keys(firstElemnt)
      keys.forEach(key => {
        columns.push(columnObject(key))
      })
    }
  }
  return columns;
}

export function parseDataForRows(_data) {
  var rows = []
  if (_data && isArray(_data) && !isEmpty(_data)) {
    const data = _data.filter(row => !!row)
    rows = data.map(row => flatten(row))
  }
  return rows;
}

export function parseCell(val) {
  return val ? val : JSON.stringify(val);
}

export function filterRowsByValue(value, rows) {
  return filter(rows, (row) => {
    const regex = new RegExp('.*?' + value + '.*?', 'i')
    var hasMatch = false
    forOwn(row, (val, key) => {
      hasMatch = hasMatch || regex.test(val)
    })
    return hasMatch;
  });
}

export function filterRows(value, rows) {
  if (!value) {
    return rows;
  } else {
    return filterRowsByValue(value, rows);
  }
}

export function sliceRowsPerPage(rows, currentPage, perPage) {
  if (perPage && perPage > 0) {
    const numRows = rows.length
    const numPages = Math.ceil( numRows / perPage )
    const start = perPage * (currentPage - 1)
    const end = perPage * currentPage
    return rows.slice(start, end);
  }
  return rows;
}
