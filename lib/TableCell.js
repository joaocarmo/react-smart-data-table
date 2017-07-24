'use strict'

// Import modules
import React from 'react'
import PropTypes from 'prop-types'

class TableCell extends React.Component {
  getRenderValue() {
    const { content, children } = this.props
    return content ? content : (children ? children : '');
  }

  highlightValue(value, filterValue) {
    const regex = new RegExp('.*?' + filterValue + '.*?', 'i')
    if (filterValue && regex.test(value)) {
      const valueStr = String(value)
      const splitStr = valueStr.toLowerCase().split(filterValue.toLowerCase())
      const nFirst = splitStr[0].length
      const nLast = splitStr[1].length
      const nHighlight = filterValue.length
      const first = valueStr.substring(0, nFirst)
      const highlight = valueStr.substring(nFirst, nFirst + nHighlight)
      const last = valueStr.substring(nFirst + nHighlight)
      return (
        <span>
          {first}
          <span className='rsdt highlight'>
            {highlight}
          </span>
          {last}
        </span>
      );
    } else {
      return value;
    }
  }

  insertLinks(value, withLinks) {
    return withLinks ? 'withLinks' : value;
  }

  renderDisplayValue() {
    const { filterValue, withLinks } = this.props
    const value = this.getRenderValue()
    return this.insertLinks(this.highlightValue(value, filterValue), withLinks)
  }

  render() {
    return (
      <span>
        {this.renderDisplayValue()}
      </span>
    );
  }
}

// Defines the type of data expected in each passed prop
TableCell.propTypes = {
  content: PropTypes.string,
  filterValue: PropTypes.string,
  withLinks: PropTypes.bool
}

// Defines the default values for not passing a certain prop
TableCell.defaultProps = {
  content: '',
  filterValue: '',
  withLinks: false
}

export default TableCell
