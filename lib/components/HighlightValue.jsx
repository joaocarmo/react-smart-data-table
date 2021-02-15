import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { highlightValueParts } from '../helpers/functions'

const HighlightValue = ({ children, filterValue }) => {
  const { first, highlight, last } = useMemo(
    () => highlightValueParts(children, filterValue),
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

export default HighlightValue
