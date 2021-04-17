import { memo, MouseEvent, useCallback } from 'react'
import PropTypes from 'prop-types'
import cx from 'clsx'
import * as utils from '../helpers/functions'
import '../css/paginator.css'

export type PageChangeFn = (
  event: MouseEvent<HTMLElement>,
  { activePage: number },
) => void

interface PaginatorItemProps {
  active: boolean
  value: number
  text: string
  onPageChange: PageChangeFn
}

const areEqual = (
  { active: prevActive, value: prevValue, text: prevText },
  { active: nextActive, value: nextValue, text: nextText },
) =>
  prevActive === nextActive && prevValue === nextValue && prevText === nextText

const PaginatorItem = ({
  active,
  value,
  text,
  onPageChange,
}: PaginatorItemProps) => {
  const handleOnPageChange = useCallback(
    (event) => {
      onPageChange(event, { activePage: value })
    },
    [onPageChange, value],
  )

  return (
    <button
      className={cx('rsdt', 'rsdt-paginate', { active }, 'button')}
      type="button"
      onClick={handleOnPageChange}
      disabled={utils.isUndefined(value)}
    >
      {text}
    </button>
  )
}

/* Defines the type of data expected in each passed prop */
PaginatorItem.propTypes = {
  active: PropTypes.bool.isRequired,
  value: PropTypes.number,
  text: PropTypes.string.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

PaginatorItem.defaultProps = {
  value: undefined,
}

export default memo(PaginatorItem, areEqual)
