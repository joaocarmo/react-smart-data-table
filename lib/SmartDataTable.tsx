import { Component, ComponentType, MouseEvent, ReactNode } from 'react'
import PropTypes from 'prop-types'
import cx from 'clsx'
import CellValue from './components/CellValue'
import ErrorBoundary from './components/ErrorBoundary'
import Paginator from './components/Paginator'
import Table from './components/Table'
import Toggles from './components/Toggles'
import withPagination, {
  WrappedComponentProps,
} from './components/helpers/with-pagination'
import {
  Column,
  fetchData,
  Headers,
  isEmpty,
  isFunction,
  isString,
  KeyResolverFN,
  ParseBool,
  parseDataForColumns,
  parseDataForRows,
  ParseImg,
  RowClickFN,
  sliceRowsPerPage,
  sortData,
  Sorting,
  UnknownObject,
} from './helpers/functions'
import {
  DEFAULT_DATA_KEY,
  defaultHeader,
  ORDER_ASC,
  ORDER_DESC,
} from './helpers/constants'
import './css/basic.css'

interface SmartDataTableProps {
  className: string
  data: string | UnknownObject[]
  dataKey: string
  dataKeyResolver: KeyResolverFN
  dataRequestOptions: RequestInit
  dynamic: boolean
  emptyTable: ReactNode
  filterValue: string
  headers: Headers
  hideUnordered: boolean
  loader: ReactNode
  name: string
  onRowClick: RowClickFN
  orderedHeaders: string[]
  paginator: ComponentType<WrappedComponentProps>
  parseBool: boolean | ParseBool
  parseImg: boolean | ParseImg
  perPage: number
  sortable: boolean
  withFooter: boolean
  withHeader: boolean
  withLinks: boolean
  withToggles: boolean
}

interface SmartDataTableState {
  activePage: number
  asyncData: UnknownObject[]
  colProperties: Headers
  columns: Column[]
  isLoading: boolean
  prevFilterValue: string
  sorting: Sorting
}

class SmartDataTable extends Component<
  SmartDataTableProps,
  SmartDataTableState
> {
  static propTypes

  static defaultProps

  constructor(props: SmartDataTableProps) {
    super(props)

    const { headers: colProperties = {} } = props

    this.state = {
      activePage: 1,
      asyncData: [],
      colProperties,
      columns: [],
      isLoading: false,
      prevFilterValue: '',
      sorting: {
        key: '',
        dir: '',
      },
    }
  }

  static getDerivedStateFromProps(
    props: SmartDataTableProps,
    state: SmartDataTableState,
  ): SmartDataTableState | null {
    const { filterValue } = props
    const { prevFilterValue } = state

    if (filterValue !== prevFilterValue) {
      return {
        ...state,
        activePage: 1,
        prevFilterValue: filterValue,
      }
    }

    return null
  }

  componentDidMount(): void {
    void this.fetchData()
  }

  componentDidUpdate(prevProps: SmartDataTableProps): void {
    const { data } = this.props
    const { data: prevData } = prevProps

    if (
      isString(data) &&
      (typeof data !== typeof prevData || data !== prevData)
    ) {
      void this.fetchData()
    }
  }

  handleRowClick = (
    event: MouseEvent<HTMLElement>,
    rowData: UnknownObject,
    rowIndex: number,
    tableData: UnknownObject[],
  ): void => {
    const { onRowClick } = this.props

    if (onRowClick) {
      onRowClick(event, { rowData, rowIndex, tableData })
    }
  }

  handleColumnToggle = (key: string): void => {
    const { colProperties } = this.state
    const newColProperties = { ...colProperties }

    if (!newColProperties[key]) {
      newColProperties[key] = {
        ...defaultHeader,
        key,
      }
    }

    newColProperties[key].invisible = !newColProperties[key].invisible

    this.setState({ colProperties: newColProperties })
  }

  handleOnPageChange = (
    event: MouseEvent<HTMLElement>,
    { activePage }: { activePage: number },
  ): void => {
    this.setState({ activePage })
  }

  handleSortChange(column: Column): void {
    const { sorting } = this.state
    const { key } = column
    let dir = ''

    if (key !== sorting.key) {
      sorting.dir = ''
    }

    if (sorting.dir) {
      if (sorting.dir === ORDER_ASC) {
        dir = ORDER_DESC
      } else {
        dir = ''
      }
    } else {
      dir = ORDER_ASC
    }

    this.setState({
      sorting: {
        key,
        dir,
      },
    })
  }

  getColumns(force = false): Column[] {
    const { asyncData, columns } = this.state
    const { data, headers, orderedHeaders, hideUnordered } = this.props

    if (!force && !isEmpty(columns)) {
      return columns
    }

    if (isString(data)) {
      return parseDataForColumns(
        asyncData,
        headers,
        orderedHeaders,
        hideUnordered,
      )
    }

    return parseDataForColumns(
      data as UnknownObject[],
      headers,
      orderedHeaders,
      hideUnordered,
    )
  }

  getRows(): UnknownObject[] {
    const { asyncData, colProperties, sorting } = this.state
    const { data, filterValue } = this.props

    if (isString(data)) {
      return sortData(
        filterValue,
        colProperties,
        sorting,
        parseDataForRows(asyncData),
      )
    }

    return sortData(
      filterValue,
      colProperties,
      sorting,
      parseDataForRows(data as UnknownObject[]),
    )
  }

  async fetchData(): Promise<void> {
    const {
      data,
      dataKey,
      dataKeyResolver,
      dataRequestOptions: options,
    } = this.props

    if (isString(data)) {
      this.setState({ isLoading: true })

      try {
        const asyncData = await fetchData(data, {
          dataKey,
          dataKeyResolver,
          options,
        })

        this.setState({
          asyncData,
          isLoading: false,
          columns: this.getColumns(true),
        })
      } catch (err) {
        this.setState({
          isLoading: false,
        })

        throw new Error(err)
      }
    }
  }

  renderSorting(column: Column): ReactNode {
    const {
      sorting: { key, dir },
    } = this.state
    let sortingIcon = 'rsdt-sortable-icon'

    if (key === column.key) {
      if (dir) {
        if (dir === ORDER_ASC) {
          sortingIcon = 'rsdt-sortable-asc'
        } else {
          sortingIcon = 'rsdt-sortable-desc'
        }
      }
    }

    return (
      <i
        className={cx('rsdt', sortingIcon)}
        onClick={() => this.handleSortChange(column)}
        onKeyDown={() => this.handleSortChange(column)}
        role="button"
        tabIndex={0}
        aria-label="sorting column"
      />
    )
  }

  renderHeader(columns: Column[]): ReactNode {
    const { colProperties } = this.state
    const { sortable } = this.props
    const headers = columns.map((column) => {
      const thisColProps = colProperties[column.key]
      const showCol = !thisColProps || !thisColProps.invisible
      if (showCol) {
        return (
          <Table.HeaderCell key={column.key}>
            <span>{column.text}</span>
            <span className="rsdt rsdt-sortable">
              {sortable && column.sortable ? this.renderSorting(column) : null}
            </span>
          </Table.HeaderCell>
        )
      }

      return null
    })

    return <Table.Row>{headers}</Table.Row>
  }

  renderRow(columns: Column[], row: UnknownObject, i: number): ReactNode {
    const { colProperties } = this.state
    const { withLinks, filterValue, parseBool, parseImg } = this.props

    return columns.map((column, j) => {
      const thisColProps = { ...colProperties[column.key] }
      const showCol = !thisColProps.invisible
      const transformFn = thisColProps.transform

      if (showCol) {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Table.Cell key={`row-${i}-column-${j}`}>
            {isFunction(transformFn) ? (
              transformFn(row[column.key], i, row)
            ) : (
              <ErrorBoundary>
                <CellValue
                  withLinks={withLinks}
                  filterValue={filterValue}
                  parseBool={parseBool}
                  parseImg={parseImg}
                  filterable={thisColProps.filterable}
                  isImg={thisColProps.isImg}
                >
                  {row[column.key]}
                </CellValue>
              </ErrorBoundary>
            )}
          </Table.Cell>
        )
      }

      return null
    })
  }

  renderBody(columns: Column[], rows: UnknownObject[]): ReactNode {
    const { perPage } = this.props
    const { activePage } = this.state
    const visibleRows = sliceRowsPerPage(rows, activePage, perPage)
    const tableRows = visibleRows.map((row, i) => (
      <Table.Row
        // eslint-disable-next-line react/no-array-index-key
        key={`row-${i}`}
        onClick={(e) => this.handleRowClick(e, row, i, rows)}
      >
        {this.renderRow(columns, row, i)}
      </Table.Row>
    ))

    return <Table.Body>{tableRows}</Table.Body>
  }

  renderToggles(columns: Column[]): ReactNode {
    const { colProperties } = this.state
    const { withToggles } = this.props

    if (withToggles) {
      return (
        <ErrorBoundary>
          <Toggles
            columns={columns}
            colProperties={colProperties}
            handleColumnToggle={this.handleColumnToggle}
          />
        </ErrorBoundary>
      )
    }

    return null
  }

  renderPagination(rows: UnknownObject[]): ReactNode {
    const { perPage, paginator: PaginatorComponent } = this.props
    const { activePage } = this.state
    const Paginate = withPagination(PaginatorComponent)

    if (perPage && perPage > 0) {
      return (
        <ErrorBoundary>
          <Paginate
            rows={rows}
            perPage={perPage}
            activePage={activePage}
            onPageChange={this.handleOnPageChange}
          />
        </ErrorBoundary>
      )
    }

    return null
  }

  render(): ReactNode {
    const {
      className,
      dynamic,
      emptyTable,
      loader,
      name,
      withFooter,
      withHeader,
    } = this.props
    const { isLoading } = this.state
    const columns = this.getColumns(dynamic)
    const rows = this.getRows()

    if (isLoading) {
      return loader
    }

    if (isEmpty(rows)) {
      return emptyTable
    }

    return (
      <section className="rsdt rsdt-container">
        {this.renderToggles(columns)}
        <Table data-table-name={name} className={className}>
          {withHeader && (
            <Table.Header>{this.renderHeader(columns)}</Table.Header>
          )}
          {this.renderBody(columns, rows)}
          {withFooter && (
            <Table.Footer>{this.renderHeader(columns)}</Table.Footer>
          )}
        </Table>
        {this.renderPagination(rows)}
      </section>
    )
  }
}

// Defines the type of data expected in each passed prop
SmartDataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  dataKey: PropTypes.string,
  dataKeyResolver: PropTypes.func,
  dataRequestOptions: PropTypes.objectOf(PropTypes.any),
  dynamic: PropTypes.bool,
  emptyTable: PropTypes.node,
  filterValue: PropTypes.string,
  headers: PropTypes.shape({
    key: PropTypes.string,
    text: PropTypes.string,
    invisible: PropTypes.bool,
    sortable: PropTypes.bool,
    filterable: PropTypes.bool,
    isImg: PropTypes.oneOf([
      PropTypes.bool,
      PropTypes.shape({
        style: PropTypes.objectOf(PropTypes.any),
        className: PropTypes.string,
      }),
    ]),
    transform: PropTypes.func,
  }),
  hideUnordered: PropTypes.bool,
  loader: PropTypes.node,
  name: PropTypes.string,
  onRowClick: PropTypes.func,
  orderedHeaders: PropTypes.arrayOf(PropTypes.string),
  paginator: PropTypes.elementType,
  parseBool: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  parseImg: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  perPage: PropTypes.number,
  sortable: PropTypes.bool,
  withFooter: PropTypes.bool,
  withHeader: PropTypes.bool,
  withLinks: PropTypes.bool,
  withToggles: PropTypes.bool,
}

// Defines the default values for not passing a certain prop
SmartDataTable.defaultProps = {
  className: '',
  dataKey: DEFAULT_DATA_KEY,
  dataKeyResolver: null,
  dataRequestOptions: {},
  dynamic: false,
  emptyTable: null,
  filterValue: '',
  headers: {},
  hideUnordered: false,
  loader: null,
  name: 'reactsmartdatatable',
  onRowClick: () => null,
  orderedHeaders: [],
  paginator: Paginator,
  parseBool: false,
  parseImg: false,
  perPage: 0,
  sortable: false,
  withFooter: false,
  withHeader: true,
  withLinks: false,
  withToggles: false,
}

export default SmartDataTable
