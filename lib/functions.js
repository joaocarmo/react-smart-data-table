function capitalize(w) {
  return w[0].toUpperCase() + w.substring(1).toLowerCase();
}

function parseHeader(val) {

  if (typeof val === 'string') {
    const underscore = val.split('_')
    const parser = /^[a-z]+|[A-Z][a-z]*/g

    if (underscore.length > 1) {
      return underscore.map(m => m ? capitalize(m) : '').join(' ').trim();
    } else {
      return val.match(parser).map(m => m ? capitalize(m) : '').join(' ').trim();
    }

  }

  return '';
}

function parseCell(val) {
  return val ? val : JSON.stringify(val);
}

export { parseHeader, parseCell }
