import type { PageChangeFn } from '../PaginatorItem'

export interface WrappedComponentProps {
  activePage: number
  onPageChange: PageChangeFn
  totalPages: number
}
