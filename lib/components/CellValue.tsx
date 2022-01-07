import { FC, memo, useCallback, useMemo, ReactNode } from 'react'
import PropTypes from 'prop-types'
import { find as linkifyFind } from 'linkifyjs'
import HighlightValue from './HighlightValue'
import * as utils from '../helpers/functions'
import * as constants from '../helpers/constants'

export interface CellValueProps {
  children: ReactNode
  content?: ReactNode
  filterable: boolean
  filterValue: string
  isImg: boolean
  parseBool: boolean | utils.ParseBool
  parseImg: boolean | utils.ParseImg
  withLinks: boolean
}

const CellValue = ({
  children,
  content,
  filterable,
  filterValue,
  isImg,
  parseBool,
  parseImg,
  withLinks,
}: CellValueProps) => {
  const value = useMemo(
    () => utils.getRenderValue({ children, content, parseBool }),
    [children, content, parseBool],
  )

  const highlightValue = useCallback(() => {
    if (!filterable) {
      return value
    }

    return (
      <HighlightValue data-testid="cell-value" filterValue={filterValue}>
        {value}
      </HighlightValue>
    )
  }, [filterValue, filterable, value])

  const renderImage = useCallback(
    ({ bypass = false }: { bypass?: boolean } = {}) => {
      const shouldBeAnImg = isImg || bypass || utils.isImage(value)

      if (shouldBeAnImg) {
        const { style, className } =
          typeof parseImg === 'boolean'
            ? { style: undefined, className: undefined }
            : parseImg

        return (
          <img
            src={value}
            style={style}
            className={className}
            alt={constants.DEFAULT_IMG_ALT}
          />
        )
      }

      return null
    },
    [isImg, parseImg, value],
  )

  const parseURLs = useCallback(() => {
    const grabLinks = linkifyFind(value)
    const highlightedValue = highlightValue()

    if (utils.isEmpty(grabLinks)) {
      if (utils.isDataURL(value)) {
        return renderImage({ bypass: true })
      }

      return highlightedValue
    }

    const firstLink = utils.head(grabLinks)
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
    return renderImage() || highlightValue()
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

export default memo(CellValue as FC<CellValueProps>)
