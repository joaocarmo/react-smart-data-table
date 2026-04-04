import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import cx from 'clsx'
import DataRow from './components/DataRow'
import ErrorBoundary from './components/ErrorBoundary'
import Paginator from './components/Paginator'
import Table from './components/Table'
import Toggles from './components/Toggles'
import { SmartDataTableContext } from './helpers/context'
import TableAction from './helpers/table-action.enum'
import { useTableReducer } from './hooks/useTableReducer'
import { useAsyncData } from './hooks/useAsyncData'
import { useColumns } from './hooks/useColumns'
import { useRows } from './hooks/useRows'
import type { SmartDataTableProps } from './types'
import * as constants from './helpers/constants'
import * as utils from './helpers/functions'
import './css/basic.css'

const EMPTY_HEADERS = {} as utils.Headers<never>
const EMPTY_ORDERED_HEADERS: string[] = []
const EMPTY_REQUEST_OPTIONS: RequestInit = {}
const NOOP_ROW_CLICK = () => null

function SmartDataTable<T = utils.UnknownObject>({
  className = '',
  data,
  dataKey = constants.DEFAULT_DATA_KEY,
  dataKeyResolver = null,
  dataRequestOptions = EMPTY_REQUEST_OPTIONS,
  dataSampling = 0,
  dynamic = false,
  emptyTable = null,
  filterValue = '',
  headers = EMPTY_HEADERS as utils.Headers<T>,
  hideUnordered = false,
  loader = null,
  name = 'reactsmartdatatable',
  onRowClick = NOOP_ROW_CLICK,
  orderedHeaders = EMPTY_ORDERED_HEADERS,
  paginator: PaginatorComponent = Paginator,
  parseBool = false,
  parseImg = false,
  perPage = 0,
  rowClassName,
  sortable = false,
  withFooter = false,
  withHeader = true,
  withLinks = false,
  withToggles = false,
}: Partial<SmartDataTableProps<T>>): ReactNode {
  const [state, dispatch] = useTableReducer<T>(headers)
  const {
    activePage,
    asyncData,
    colProperties,
    columns: stateColumns,
    isLoading,
    sorting,
  } = state

  // Sync filter value → reset page
  const prevFilterRef = useRef(filterValue)

  useEffect(() => {
    if (filterValue !== prevFilterRef.current) {
      prevFilterRef.current = filterValue
      dispatch({ type: TableAction.ResetPageForFilter, filterValue })
    }
  }, [filterValue, dispatch])

  // Fetch async data
  useAsyncData<T>({
    data: data as string | T[],
    dataKey,
    dataKeyResolver,
    dataRequestOptions,
    headers,
    orderedHeaders,
    hideUnordered,
    dataSampling,
    dispatch,
  })

  // Layer 1: Resolve data source
  const resolvedData = useMemo(
    () => (utils.isString(data) ? asyncData : (data as T[])),
    [data, asyncData],
  )

  // Memoized columns
  const columns = useColumns<T>({
    resolvedData,
    stateColumns,
    headers,
    orderedHeaders,
    hideUnordered,
    dataSampling,
    dynamic,
  })

  // Memoized row pipeline
  const { filteredRows, visibleRows } = useRows<T>({
    resolvedData,
    sorting,
    colProperties,
    filterValue,
    activePage,
    perPage,
  })

  // Stable callbacks
  const handleOnPageChange = useCallback(
    (
      _e: MouseEvent<HTMLElement>,
      { activePage: page }: { activePage: number },
    ) => {
      dispatch({ type: TableAction.SetActivePage, activePage: page })
    },
    [dispatch],
  )

  const handleSortChange = useCallback(
    (column: utils.Column<T>) => {
      dispatch({ type: TableAction.SetSorting, column })
    },
    [dispatch],
  )

  const handleColumnToggle = useCallback(
    (key: string) => {
      dispatch({ type: TableAction.ToggleColumn, key })
    },
    [dispatch],
  )

  const handleColumnToggleAll = useCallback(
    (toggleColumns: utils.Column<T>[]) => (isChecked: boolean) => {
      dispatch({
        type: TableAction.ToggleAllColumns,
        columns: toggleColumns,
        isChecked,
      })
    },
    [dispatch],
  )

  const handleRowClick = useCallback(
    (
      event: MouseEvent<HTMLElement>,
      rowData: T,
      rowIndex: number,
      tableData: T[],
    ) => {
      if (typeof onRowClick === 'function') {
        onRowClick(event, { rowData, rowIndex, tableData })
      }
    },
    [onRowClick],
  )

  // Pagination: totalPages computed inline (fixes stale HOC bug)
  const totalPages = useMemo(
    () => (perPage > 0 ? Math.ceil(filteredRows.length / perPage) : 0),
    [filteredRows.length, perPage],
  )

  // Memoized toggle-all for current columns
  const toggleAll = useMemo(
    () => handleColumnToggleAll(columns),
    [handleColumnToggleAll, columns],
  )

  // Render helpers
  const renderSorting = (column: utils.Column<T>): ReactNode => {
    const { key, dir } = sorting
    let sortingIcon = 'rsdt-sortable-icon'

    if (key === column.key) {
      if (dir) {
        sortingIcon =
          dir === constants.ORDER_ASC
            ? 'rsdt-sortable-asc'
            : 'rsdt-sortable-desc'
      }
    }

    return (
      <i
        className={cx('rsdt', sortingIcon)}
        onClick={() => handleSortChange(column)}
        onKeyDown={() => handleSortChange(column)}
        role="button"
        tabIndex={0}
        aria-label="sorting column"
      />
    )
  }

  const renderHeader = (): ReactNode => {
    const headerCells = columns.map((column) => {
      const thisColProps = colProperties[column.key]
      const showCol = !thisColProps || !thisColProps.invisible

      if (!showCol) {
        return null
      }

      return (
        <Table.HeaderCell data-column-name={column.key} key={column.key}>
          <span>{column.text}</span>
          <span className="rsdt rsdt-sortable">
            {sortable && column.sortable ? renderSorting(column) : null}
          </span>
        </Table.HeaderCell>
      )
    })

    return <Table.Row>{headerCells}</Table.Row>
  }

  const renderBody = (): ReactNode => {
    const tableRows = visibleRows.map((row, idx) => (
      // eslint-disable-next-line @eslint-react/no-array-index-key -- rows have no guaranteed unique ID in generic data tables
      <ErrorBoundary key={`row-${idx}`}>
        <DataRow<T>
          row={row}
          rowIndex={idx}
          columns={columns}
          colProperties={colProperties}
          withLinks={withLinks}
          filterValue={filterValue}
          parseBool={parseBool}
          parseImg={parseImg}
          onRowClick={handleRowClick}
          rowClassName={rowClassName}
          tableData={filteredRows}
        />
      </ErrorBoundary>
    ))

    return <Table.Body>{tableRows}</Table.Body>
  }

  const renderToggles = (): ReactNode => {
    const togglesProps = typeof withToggles === 'object' ? withToggles : {}

    if (!withToggles) {
      return null
    }

    return (
      <ErrorBoundary>
        <Toggles<T>
          columns={columns}
          colProperties={colProperties}
          handleColumnToggle={handleColumnToggle}
          handleColumnToggleAll={toggleAll}
          selectAll={togglesProps?.selectAll}
        />
      </ErrorBoundary>
    )
  }

  const renderPagination = (): ReactNode => {
    if (!perPage || perPage <= 0 || !totalPages) {
      return null
    }

    return (
      <ErrorBoundary>
        <PaginatorComponent
          totalPages={totalPages}
          activePage={activePage}
          onPageChange={handleOnPageChange}
        />
      </ErrorBoundary>
    )
  }

  if (isLoading) {
    return loader
  }

  if (utils.isEmpty(filteredRows)) {
    return emptyTable
  }

  return (
    <SmartDataTableContext value={state}>
      <section className="rsdt rsdt-container">
        {renderToggles()}
        <Table data-table-name={name} className={className}>
          {withHeader && <Table.Header>{renderHeader()}</Table.Header>}
          {renderBody()}
          {withFooter && <Table.Footer>{renderHeader()}</Table.Footer>}
        </Table>
        {renderPagination()}
      </section>
    </SmartDataTableContext>
  )
}

export default SmartDataTable
