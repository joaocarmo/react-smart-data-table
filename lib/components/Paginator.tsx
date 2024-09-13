import { memo, useMemo } from 'react'
import PaginatorItem, { PageChangeFn } from './PaginatorItem'
import * as utils from '../helpers/functions'
import '../css/paginator.css'

export interface PaginatorProps {
  activePage: number
  totalPages: number
  onPageChange: PageChangeFn
}

const areEqual = (
  { activePage: prevActivePage, totalPages: prevTotalPages },
  { activePage: nextActivePage, totalPages: nextTotalPages },
) => prevActivePage === nextActivePage && prevTotalPages === nextTotalPages

const Paginator = ({
  activePage,
  totalPages,
  onPageChange,
}: PaginatorProps) => {
  const paginatorItems = useMemo(
    () => utils.generatePagination(activePage, totalPages),
    [activePage, totalPages],
  )
  const onPageChangeFn = useMemo(
    () => (typeof onPageChange === 'function' ? onPageChange : () => null),
    [onPageChange],
  )

  return (
    <div className="rsdt rsdt-paginate">
      {paginatorItems.map(({ active, value, text }, idx) => (
        <PaginatorItem
          key={utils.isUndefined(value) ? `ellipsis-${idx}` : text}
          active={active}
          value={value}
          text={text}
          onPageChange={onPageChangeFn}
        />
      ))}
    </div>
  )
}

export default memo(Paginator, areEqual)
