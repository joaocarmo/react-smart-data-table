import { Component } from 'react'
import PropTypes from 'prop-types'
import * as linkify from 'linkifyjs'
import HighlightValue from './HighlightValue'
import { head, isDataURL, isEmpty, isImage } from '../helpers/functions'
import {
  DEFAULT_IMG_ALT,
  DEFAULT_NO_WORD,
  DEFAULT_YES_WORD,
  STR_FALSE,
  STR_ZERO,
} from '../helpers/constants'

class CellValue extends Component {
  getRenderValue() {
    const { content, parseBool, children } = this.props

    if (parseBool) {
      const { yesWord, noWord } = parseBool

      if (content === true || children === true) {
        return yesWord || DEFAULT_YES_WORD
      }

      if (content === false || children === false) {
        return noWord || DEFAULT_NO_WORD
      }
    }

    if (content === 0 || children === 0) {
      return STR_ZERO
    }

    if (content === false || children === false) {
      return STR_FALSE
    }

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

    if (!filterable) {
      return value
    }

    return <HighlightValue filterValue={filterValue}>{value}</HighlightValue>
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
          alt={DEFAULT_IMG_ALT}
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

  render() {
    const { filterValue, withLinks, parseImg } = this.props
    const value = this.getRenderValue()

    if (withLinks) {
      return this.parseURLs(value, filterValue, parseImg)
    }

    let image = null

    if (parseImg) {
      image = this.renderImage(value, parseImg)
    }

    return <span>{image || this.highlightValue(value, filterValue)}</span>
  }
}

CellValue.propTypes = {
  content: PropTypes.string,
  filterValue: PropTypes.string,
  filterable: PropTypes.bool,
  withLinks: PropTypes.bool,
  parseBool: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  parseImg: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  isImg: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
}

CellValue.defaultProps = {
  content: '',
  filterValue: '',
  filterable: true,
  withLinks: false,
  parseBool: false,
  parseImg: false,
  isImg: false,
  children: null,
}

export default CellValue
