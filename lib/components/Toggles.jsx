import { useCallback } from 'react'
import PropTypes from 'prop-types'
import '../css/toggles.css'

const Toggles = ({
  columns,
  colProperties,
  handleColumnToggle: onColumnToggle,
}) => {
  const handleToggleClick = useCallback(
    ({ target: { value } }) => onColumnToggle(value),
    [onColumnToggle],
  )

  const isColumnVisible = useCallback(
    (key) => {
      const thisColProps = colProperties[key]

      return !thisColProps || !thisColProps.invisible
    },
    [colProperties],
  )

  return (
    <nav className="rsdt rsdt-column-toggles">
      {columns.map(({ key, text } = {}) => (
        <span className="rsdt rsdt-column-toggles toggle" key={key}>
          <label htmlFor={key}>
            <input
              type="checkbox"
              id={key}
              value={key}
              name={text}
              checked={isColumnVisible(key)}
              onChange={handleToggleClick}
            />
            {text}
          </label>
        </span>
      ))}
    </nav>
  )
}

/* Defines the type of data expected in each passed prop */
Toggles.propTypes = {
  columns: PropTypes.array.isRequired,
  colProperties: PropTypes.object,
  handleColumnToggle: PropTypes.func.isRequired,
}

export default Toggles
