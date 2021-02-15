import { memo, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import * as linkify from 'linkifyjs'
import HighlightValue from './HighlightValue'
import {
  head,
  isDataURL,
  isEmpty,
  isImage,
  getRenderValue,
} from '../helpers/functions'
import { DEFAULT_IMG_ALT } from '../helpers/constants'

const CellValue = ({
  children,
  content,
  filterable,
  filterValue,
  isImg,
  parseBool,
  parseImg,
  withLinks,
}) => {
  const value = useMemo(
    () => getRenderValue({ children, content, parseBool }),
    [children, content, parseBool],
  )

  const highlightValue = useCallback(() => {
    if (!filterable) {
      return value
    }

    return <HighlightValue filterValue={filterValue}>{value}</HighlightValue>
  }, [filterValue, filterable, value])

  const renderImage = useCallback(
    ({ bypass = false } = {}) => {
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
    },
    [isImg, parseImg, value],
  )

  const parseURLs = useCallback(() => {
    const grabLinks = linkify.find(value)
    const highlightedValue = highlightValue()

    if (isEmpty(grabLinks)) {
      if (isDataURL(value)) {
        return renderImage({ bypass: true })
      }

      return highlightedValue
    }

    const firstLink = head(grabLinks)
    let image = null

    if (parseImg && firstLink.type === 'url') {
      image = renderImage()
    }

    return (
      <a href={firstLink.href} onClick={(e) => e.stopPropagation()}>
        {image || highlightedValue}
      </a>
    )
  }, [highlightValue, parseImg, renderImage, value])

  if (withLinks) {
    return parseURLs()
  }

  if (parseImg) {
    return renderImage()
  }

  return highlightValue()
}

CellValue.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  content: PropTypes.string,
  filterable: PropTypes.bool,
  filterValue: PropTypes.string,
  isImg: PropTypes.bool,
  parseBool: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  parseImg: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  withLinks: PropTypes.bool,
}

CellValue.defaultProps = {
  children: null,
  content: '',
  filterable: true,
  filterValue: '',
  isImg: false,
  parseBool: false,
  parseImg: false,
  withLinks: false,
}

export default memo(CellValue)
