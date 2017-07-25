'use strict'

// Import modules
import React from 'react'
import PropTypes from 'prop-types'
import Linkify from 'linkifyjs/react'

class TableCell extends React.Component {
  getRenderValue() {
    const { content, children } = this.props
    if (content === 0) return '0';
    if (children === 0) return '0';
    const value = content ? content : (children ? children : '')
    return String(value);
  }

  highlightValue(value, filterValue) {
    const regex = new RegExp('.*?' + filterValue + '.*?', 'i')
    if (filterValue && regex.test(value)) {
      const splitStr = value.toLowerCase().split(filterValue.toLowerCase())
      const nFirst = splitStr[0].length
      const nLast = splitStr[1].length
      const nHighlight = filterValue.length
      const first = value.substring(0, nFirst)
      const highlight = value.substring(nFirst, nFirst + nHighlight)
      const last = value.substring(nFirst + nHighlight)
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

  insertLinks(value) {
    return <Linkify>{value}</Linkify>;
  }

  renderDisplayValue() {
    const { filterValue, withLinks } = this.props
    const value = this.getRenderValue()
    return withLinks ? this.insertLinks(value) : this.highlightValue(value, filterValue);
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
