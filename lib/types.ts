import type { ComponentType, ReactNode } from 'react'
import type { TogglesSelectAllProps } from './components/Toggles'
import type { WrappedComponentProps } from './components/helpers/with-pagination'
import * as utils from './helpers/functions'

export interface SmartDataTableProps<T = utils.UnknownObject> {
  className: string
  data: string | T[]
  dataKey: string
  dataKeyResolver: utils.KeyResolverFN<T>
  dataRequestOptions: RequestInit
  dataSampling: number
  dynamic: boolean
  emptyTable: ReactNode
  filterValue: string
  headers: utils.Headers<T>
  hideUnordered: boolean
  loader: ReactNode
  name: string
  onRowClick: utils.RowClickFN<T>
  orderedHeaders: string[]
  paginator: ComponentType<WrappedComponentProps>
  parseBool: boolean | utils.ParseBool
  parseImg: boolean | utils.ParseImg
  perPage: number
  sortable: boolean
  withFooter: boolean
  withHeader: boolean
  withLinks: boolean
  withToggles: boolean | { selectAll?: TogglesSelectAllProps }
}

export interface SmartDataTableState<T = utils.UnknownObject> {
  activePage: number
  asyncData: T[]
  colProperties: utils.Headers<T>
  columns: utils.Column<T>[]
  isLoading: boolean
  prevFilterValue: string
  sorting: utils.Sorting
}
