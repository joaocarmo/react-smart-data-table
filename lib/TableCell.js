// Import modules
import React from 'react'
import PropTypes from 'prop-types'
import * as linkify from 'linkifyjs'
import isEmpty from 'lodash/isEmpty'

class TableCell extends React.Component {
  getRenderValue() {
    const { content, parseBool, children } = this.props
    if (parseBool) {
      if (content === true || children === true) return 'Yes'
      if (content === false || children === false) return 'No'
    }
    if (content === 0 || children === 0) return '0'
    if (content === false || children === false) return 'false'
    let value = ''
    if (content) {
      value = content
    } else if (children) {
      value = children
    }
    return `${value}`
  }

  highlightValue(value, filterValue) {
    const regex = new RegExp(`.*?${filterValue}.*?`, 'i')
    if (filterValue && regex.test(value)) {
      const splitStr = value.toLowerCase().split(filterValue.toLowerCase())
      const nFirst = splitStr[0].length
      // const nLast = splitStr[1].length
      const nHighlight = filterValue.length
      const first = value.substring(0, nFirst)
      const highlight = value.substring(nFirst, nFirst + nHighlight)
      const last = value.substring(nFirst + nHighlight)
      return (
        <span>
          {first}
          <span className='rsdt rsdt-highlight'>
            {highlight}
          </span>
          {last}
        </span>
      )
    }
    return value
  }

  insertLinks(value, filterValue) {
    const grabLinks = linkify.find(value)
    const highlightedValue = this.highlightValue(value, filterValue)
    if (isEmpty(grabLinks)) {
      return highlightedValue
    }
    const firstLink = grabLinks[0]
    return (
      <a href={firstLink.href}>
        {highlightedValue}
      </a>
    )
  }

  renderDisplayValue() {
    const { filterValue, withLinks } = this.props
    const value = this.getRenderValue()
    return withLinks ? this.insertLinks(value, filterValue) : this.highlightValue(value, filterValue)
  }

  render() {
    return (
      <span>
        {this.renderDisplayValue()}
      </span>
    )
  }
}

// Defines the type of data expected in each passed prop
TableCell.propTypes = {
  content: PropTypes.string,
  filterValue: PropTypes.string,
  withLinks: PropTypes.bool,
  parseBool: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.bool,
  ]),
}

// Defines the default values for not passing a certain prop
TableCell.defaultProps = {
  content: '',
  filterValue: '',
  withLinks: false,
  parseBool: false,
  children: null,
}

export default TableCell
