import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import * as constants from '../helpers/constants'

export type ColumnToggleAllFn = (isChecked: boolean) => void

export interface SelectAllProps {
  locale?: {
    selectAll?: string
    unSelectAll?: string
  }
  handleToggleAll?: ColumnToggleAllFn
}

const SelectAll = ({
  locale: { selectAll, unSelectAll },
  handleToggleAll,
}: SelectAllProps) => {
  const [isChecked, setIsChecked] = useState(false)

  const toggleIsChecked = useCallback(() => {
    if (typeof handleToggleAll === 'function') {
      handleToggleAll(isChecked)
    }

    setIsChecked(!isChecked)
  }, [handleToggleAll, isChecked])

  return (
    <span className="rsdt rsdt-column-toggles toggle">
      <label htmlFor="select-all">
        <input
          type="checkbox"
          id="select-all"
          value="select-all"
          name="select-all"
          checked={isChecked}
          onChange={toggleIsChecked}
        />
        {isChecked ? unSelectAll : selectAll}
      </label>
    </span>
  )
}

SelectAll.propTypes = {
  locale: PropTypes.shape({
    selectAll: PropTypes.string,
    unSelectAll: PropTypes.string,
  }),
  handleToggleAll: PropTypes.func.isRequired,
}

SelectAll.defaultProps = {
  locale: {
    selectAll: constants.DEFAULT_SELECT_ALL,
    unSelectAll: constants.DEFAULT_UNSELECT_ALL,
  },
}

export default SelectAll
