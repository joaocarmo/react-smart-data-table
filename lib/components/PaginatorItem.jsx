import { useCallback } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { isUndefined } from '../helpers/functions'
import '../css/paginator.css'

const PaginatorItem = ({ active, value, text, onPageChange }) => {
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
      disabled={isUndefined(value)}
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

export default PaginatorItem
