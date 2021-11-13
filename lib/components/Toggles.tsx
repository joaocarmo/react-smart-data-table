import { ElementRef, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import SelectAll, {
  ColumnToggleAllFn,
  SelectAllProps,
  selectAllPropTypes,
} from './SelectAll'
import * as utils from '../helpers/functions'
import * as constants from '../helpers/constants'
import '../css/toggles.css'

type ColumnToggleFn = (key: string) => void

export type TogglesSelectAllProps = boolean | SelectAllProps

interface TogglesProps {
  columns: utils.Column[]
  colProperties: utils.Headers
  handleColumnToggle: ColumnToggleFn
  handleColumnToggleAll: ColumnToggleAllFn
  selectAll?: TogglesSelectAllProps
}

type SelectAllElement = ElementRef<typeof SelectAll>

const Toggles = ({
  columns,
  colProperties,
  handleColumnToggle,
  handleColumnToggleAll,
  selectAll,
}: TogglesProps): JSX.Element => {
  const selectAllProps = typeof selectAll === 'object' ? selectAll : {}
  const selectAllRef = useRef<SelectAllElement>(null)

  const handleToggleClick = useCallback(
    ({ target: { value } }) => {
      handleColumnToggle(String(value))

      if (selectAllRef?.current && value) {
        selectAllRef.current.setUnchecked()
      }
    },
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
          locale={selectAllProps?.locale}
          handleToggleAll={
            typeof selectAllProps?.handleToggleAll === 'function'
              ? selectAllProps?.handleToggleAll
              : handleColumnToggleAll
          }
          ref={selectAllRef}
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

export const togglesSelectAllPropTypes = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.shape(selectAllPropTypes),
])

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
  selectAll: togglesSelectAllPropTypes,
}

Toggles.defaultProps = {
  selectAll: false,
}

export default Toggles
