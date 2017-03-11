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

export { parseHeader, parseCell }
