// Import modules
import React from 'react'
import PropTypes from 'prop-types'
import * as linkify from 'linkifyjs'
// Import functions
import {
  isDataURL,
  isImage,
  isEmpty,
  head,
  memoizedHighlightValueParts as highlightValueParts,
} from '../helpers/functions'

class TableCell extends React.Component {
  getRenderValue() {
    const { content, parseBool, children } = this.props
    if (parseBool) {
      const { yesWord, noWord } = parseBool
      if (content === true || children === true) return yesWord || 'Yes'
      if (content === false || children === false) return noWord || 'No'
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
    const { filterable } = this.props
    if (!filterable) return value
    const { first, highlight, last } = highlightValueParts(value, filterValue)
    if (!first && !highlight && !last) return value
    return (
      <span>
        {first}
        <span className="rsdt rsdt-highlight">{highlight}</span>
        {last}
      </span>
    )
  }

  renderImage(value, parseImg = {}, bypass = false) {
    const { isImg } = this.props
    const shouldBeAnImg = isImg || bypass || isImage(value)
    if (shouldBeAnImg) {
      const { style, className } = parseImg
      return (
        <img
          src={value}
          style={style}
          className={className}
          alt="URL detected by the renderer"
        />
      )
    }
    return null
  }

  parseURLs(value, filterValue, parseImg) {
    const grabLinks = linkify.find(value)
    const highlightedValue = this.highlightValue(value, filterValue)
    if (isEmpty(grabLinks)) {
      if (isDataURL(value)) {
        return this.renderImage(value, parseImg, true)
      }
      return highlightedValue
    }
    const firstLink = head(grabLinks)
    let image = null
    if (parseImg && firstLink.type === 'url') {
      image = this.renderImage(value, parseImg)
    }
    return (
      <a href={firstLink.href} onClick={(e) => e.stopPropagation()}>
        {image || highlightedValue}
      </a>
    )
  }

  renderDisplayValue() {
    const { filterValue, withLinks, parseImg } = this.props
    const value = this.getRenderValue()
    if (withLinks) {
      return this.parseURLs(value, filterValue, parseImg)
    }
    let image = null
    if (parseImg) {
      image = this.renderImage(value, parseImg)
    }
    return image || this.highlightValue(value, filterValue)
  }

  render() {
    return <span>{this.renderDisplayValue()}</span>
  }
}

// Defines the type of data expected in each passed prop
TableCell.propTypes = {
  content: PropTypes.string,
  filterValue: PropTypes.string,
  filterable: PropTypes.bool,
  withLinks: PropTypes.bool,
  parseBool: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  parseImg: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  isImg: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
}

// Defines the default values for not passing a certain prop
TableCell.defaultProps = {
  content: '',
  filterValue: '',
  filterable: true,
  withLinks: false,
  parseBool: false,
  parseImg: false,
  isImg: false,
  children: null,
}

export { TableCell }
