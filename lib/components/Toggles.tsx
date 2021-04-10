import { MouseEvent, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Column, Headers } from '../helpers/functions'
import { defaultHeader } from '../helpers/constants'
import '../css/toggles.css'

export type ColumnToggleFn = (event: MouseEvent<HTMLElement>) => void

interface TogglesProps {
  columns: Column[]
  colProperties: Headers
  handleColumnToggle: ColumnToggleFn
}

const Toggles = ({
  columns,
  colProperties,
  handleColumnToggle: onColumnToggle,
}: TogglesProps): JSX.Element => {
  const handleToggleClick = useCallback(
    ({ target: { value } }) => onColumnToggle(value),
    [onColumnToggle],
  )

  const isColumnVisible = useCallback(
    (key: string) => {
      const thisColProps = colProperties[key]

      return !thisColProps || !thisColProps.invisible
    },
    [colProperties],
  )

  return (
    <nav className="rsdt rsdt-column-toggles">
      {columns.map(({ key, text } = defaultHeader) => (
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
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  colProperties: PropTypes.objectOf(
    PropTypes.shape({
      key: PropTypes.string,
      text: PropTypes.string,
      invisible: PropTypes.bool,
      sortable: PropTypes.bool,
      filterable: PropTypes.bool,
    }),
  ).isRequired,
  handleColumnToggle: PropTypes.func.isRequired,
}

export default Toggles
