import { FC, memo, useMemo, ReactNode } from 'react'
import PropTypes from 'prop-types'
import * as utils from '../helpers/functions'

interface HighlightValueProps {
  children: ReactNode
  filterValue: string
}

const areEqual = (
  { children: prevChildren, filterValue: prevFilterValue },
  { children: nextChildren, filterValue: nextFilterValue },
) => prevChildren === nextChildren && prevFilterValue === nextFilterValue

const HighlightValue = ({
  children,
  filterValue,
}: HighlightValueProps): ReactNode => {
  const { first, highlight, last } = useMemo(
    () => utils.highlightValueParts(children as string, filterValue),
    [children, filterValue],
  )

  if (!first && !highlight && !last) {
    return children
  }

  return (
    <span>
      {first}
      <span className="rsdt rsdt-highlight">{highlight}</span>
      {last}
    </span>
  )
}

HighlightValue.propTypes = {
  filterValue: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
}

HighlightValue.defaultProps = {
  filterValue: '',
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
}

export default memo(HighlightValue as FC<HighlightValueProps>, areEqual)
