import { useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import PropTypes from 'prop-types'
import * as utils from '../helpers/functions'

type HighlightValueProps = PropsWithChildren<{
  filterValue: string
  'data-testid'?: string
}>

const HighlightValue = ({
  children,
  filterValue,
  'data-testid': testId,
}: HighlightValueProps) => {
  const { first, highlight, last } = useMemo(
    () => utils.highlightValueParts(String(children), filterValue),
    [children, filterValue],
  )

  if (!first && !highlight && !last) {
    return children as JSX.Element
  }

  return (
    <span data-testid={testId}>
      {first}
      <span className="rsdt rsdt-highlight">{highlight}</span>
      {last}
    </span>
  )
}

HighlightValue.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  filterValue: PropTypes.string,
}

HighlightValue.defaultProps = {
  children: null,
  filterValue: '',
  'data-testid': 'highlight-value',
}

export default HighlightValue
