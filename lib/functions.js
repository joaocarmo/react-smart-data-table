import _ from 'lodash'

function capitalizeAll(arr) {
  return arr.map(m => m ? _.capitalize(m) : '').join(' ').trim();
}

function parseHeader(val) {

  if (_.isString(val)) {
    const camelCase = _.camelCase(val)
    const parser = /^[a-z]+|[A-Z][a-z]*/g

    return capitalizeAll(camelCase.match(parser));

  }

  return '';
}

function parseCell(val) {
  return val ? val : JSON.stringify(val);
}

function filterRowsByValue(value, rows) {
  return _.filter(rows, (row) => {
    const regex = new RegExp('.*?' + value + '.*?', 'i')
    var hasMatch = false
    _.forOwn(row, (val, key) => {
      hasMatch = hasMatch || regex.test(val)
    })
    return hasMatch;
  });
}

function filterVisibleRows(rows, columns) {
  var visibleRows = []
  rows.forEach(row => {
    var visibleRow = []
    row.forEach((cell, idx) => {
      if (columns[idx].visible) {
        visibleRow.push(cell)
      }
    })
    visibleRows.push(visibleRow)
  })
  return visibleRows;
}

function sliceRowsPerPage(rows, currentPage, perPage) {
  if (perPage && perPage > 0) {
    const numRows = rows.length
    const numPages = Math.ceil( numRows / perPage )
    const start = perPage * (currentPage - 1)
    const end = perPage * currentPage
    return rows.slice(start, end);
  }
  return rows;
}

function absCol(idx, columns) {
  var col = 0
  for (var i=0, N=columns.length; i<N; i++) {
    if (idx > 0) {
      col += 1
      if (columns[i].visible) {
        idx -= 1
      }
    }
  }
  return col;
}

export { parseHeader, parseCell, filterRowsByValue, filterVisibleRows, sliceRowsPerPage, absCol }
