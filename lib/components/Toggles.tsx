import { ElementRef, useCallback, useRef } from 'react'
import type { FC } from 'react'
import SelectAll, { ColumnToggleAllFn, SelectAllProps } from './SelectAll'
import * as utils from '../helpers/functions'
import * as constants from '../helpers/constants'
import '../css/toggles.css'

type ColumnToggleFn = (key: string) => void

export type TogglesSelectAllProps = boolean | SelectAllProps

interface TogglesProps<T = utils.UnknownObject> {
  columns: utils.Column<T>[]
  colProperties: utils.Headers<T>
  handleColumnToggle: ColumnToggleFn
  handleColumnToggleAll: ColumnToggleAllFn
  selectAll?: TogglesSelectAllProps
}

type SelectAllElement = ElementRef<typeof SelectAll>

const Toggles = <T,>({
  columns,
  colProperties,
  handleColumnToggle,
  handleColumnToggleAll,
  selectAll = false,
}: TogglesProps<T>): ReturnType<FC> => {
  const selectAllProps: Partial<TogglesSelectAllProps> =
    typeof selectAll === 'object' ? selectAll : {}
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

export default Toggles
