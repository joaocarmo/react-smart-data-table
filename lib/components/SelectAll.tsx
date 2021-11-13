import {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import * as constants from '../helpers/constants'

export type ColumnToggleAllFn = (isChecked: boolean) => void

export interface SelectAllProps {
  locale?: {
    selectAllWord?: string
    unSelectAllWord?: string
  }
  handleToggleAll?: ColumnToggleAllFn
}

interface SelectAllHandle {
  setUnchecked: () => void
}

const SelectAll: ForwardRefRenderFunction<SelectAllHandle, SelectAllProps> = (
  {
    locale: { selectAllWord, unSelectAllWord },
    handleToggleAll,
  }: SelectAllProps,
  ref,
) => {
  const [isChecked, setIsChecked] = useState(false)

  const toggleIsChecked = useCallback(() => {
    if (typeof handleToggleAll === 'function') {
      handleToggleAll(isChecked)
    }

    setIsChecked(!isChecked)
  }, [handleToggleAll, isChecked])

  useImperativeHandle(ref, () => ({
    setUnchecked: () => {
      if (isChecked) {
        setIsChecked(false)
      }
    },
  }))

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
        {isChecked ? unSelectAllWord : selectAllWord}
      </label>
    </span>
  )
}

const ForwardedSelectAll = forwardRef(SelectAll)

ForwardedSelectAll.propTypes = {
  locale: PropTypes.shape({
    selectAllWord: PropTypes.string,
    unSelectAllWord: PropTypes.string,
  }),
  handleToggleAll: PropTypes.func.isRequired,
}

ForwardedSelectAll.defaultProps = {
  locale: {
    selectAllWord: constants.DEFAULT_SELECT_ALL_WORD,
    unSelectAllWord: constants.DEFAULT_UNSELECT_ALL_WORD,
  },
}

export default ForwardedSelectAll
