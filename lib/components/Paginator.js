// Import modules
import React from 'react'
import PropTypes from 'prop-types'
import { generatePagination, isUndefined } from '../helpers/functions'
import '../css/paginator.css'

const PaginatorItem = ({ active, value, text, onPageChange }) => (
  <button
    className={`rsdt rsdt-paginate${active ? ' active ' : ' '}button`}
    type="button"
    onClick={(e) => onPageChange(e, { activePage: value })}
    disabled={isUndefined(value)}
  >
    {text}
  </button>
)

const Paginator = ({ activePage, totalPages, onPageChange }) => {
  const paginatorItems = generatePagination(activePage, totalPages)
  const onPageChangeFn =
    typeof onPageChange === 'function' ? onPageChange : () => null
  return (
    <div className="rsdt rsdt-paginate">
      {paginatorItems.map(({ active, value, text }, idx) => (
        <PaginatorItem
          key={isUndefined(value) ? `ellipsis-${idx}` : text}
          active={active}
          value={value}
          text={text}
          onPageChange={onPageChangeFn}
        />
      ))}
    </div>
  )
}

/* Defines the type of data expected in each passed prop */
Paginator.propTypes = {
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
}

PaginatorItem.propTypes = {
  active: PropTypes.bool.isRequired,
  value: PropTypes.number,
  text: PropTypes.string.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export { Paginator }
