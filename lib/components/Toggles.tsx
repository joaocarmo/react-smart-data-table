import { useCallback } from 'react'
import PropTypes from 'prop-types'
import SelectAll, { ColumnToggleAllFn, SelectAllProps } from './SelectAll'
import * as utils from '../helpers/functions'
import * as constants from '../helpers/constants'
import '../css/toggles.css'

type ColumnToggleFn = (key: string) => void

interface TogglesProps {
  columns: utils.Column[]
  colProperties: utils.Headers
  handleColumnToggle: ColumnToggleFn
  handleColumnToggleAll: ColumnToggleAllFn
  selectAll?: SelectAllProps
}

const Toggles = ({
  columns,
  colProperties,
  handleColumnToggle,
  handleColumnToggleAll,
  selectAll,
}: TogglesProps): JSX.Element => {
  const handleToggleClick = useCallback(
    ({ target: { value } }) => handleColumnToggle(String(value)),
    [handleColumnToggle],
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
      {selectAll && (
        <SelectAll
          locale={selectAll?.locale}
          handleToggleAll={
            typeof handleToggleAll === 'function'
              ? selectAll?.handleToggleAll
              : handleColumnToggleAll
          }
        />
      )}
      {columns.map(({ key, text } = constants.defaultHeader) => (
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
  handleColumnToggleAll: PropTypes.func.isRequired,
  selectAll: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      locale: PropTypes.shape({
        selectAll: PropTypes.string,
        unSelectAll: PropTypes.string,
      }),
      handleToggleAll: PropTypes.func,
    }),
  ]),
}

Toggles.defaultProps = {
  selectAll: true,
}

export default Toggles
