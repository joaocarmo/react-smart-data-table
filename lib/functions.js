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

export { parseHeader, parseCell, filterRowsByValue, filterVisibleRows }
