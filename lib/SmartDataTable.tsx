import { Component, MouseEvent, ReactNode } from 'react'
import PropTypes from 'prop-types'
import cx from 'clsx'
import CellValue from './components/CellValue'
import ErrorBoundary from './components/ErrorBoundary'
import Paginator from './components/Paginator'
import Table from './components/Table'
import Toggles, { togglesSelectAllPropTypes } from './components/Toggles'
import withPagination from './components/helpers/with-pagination'
import { SmartDataTableContext } from './helpers/context'
import type { SmartDataTableProps, SmartDataTableState } from './types'
import * as constants from './helpers/constants'
import * as utils from './helpers/functions'
import defaultState from './helpers/default-state'
import './css/basic.css'

class SmartDataTable<T = utils.UnknownObject> extends Component<
  SmartDataTableProps<T>,
  SmartDataTableState<T>
> {
  static propTypes

  static defaultProps

  constructor(props: SmartDataTableProps<T>) {
    super(props)

    const { headers: colProperties = {} } = props

    this.state = { ...defaultState, colProperties }
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

  componentDidMount() {
    void this.fetchData()
  }

  componentDidUpdate(prevProps: SmartDataTableProps<T>) {
    const { data } = this.props
    const { data: prevData } = prevProps

    if (
      utils.isString(data) &&
      (typeof data !== typeof prevData || data !== prevData)
    ) {
      void this.fetchData()
    }
  }

  handleRowClick = (
    event: MouseEvent<HTMLElement>,
    rowData: T,
    rowIndex: number,
    tableData: T[],
  ) => {
    const { onRowClick } = this.props

    if (typeof onRowClick === 'function') {
      onRowClick(event, { rowData, rowIndex, tableData })
    }
  }

  handleColumnToggle = (key: string) => {
    const { colProperties } = this.state
    const newColProperties = { ...colProperties }

    if (!newColProperties[key]) {
      newColProperties[key] = {
        ...constants.defaultHeader,
        key,
      }
    }

    newColProperties[key].invisible = !newColProperties[key].invisible

    this.setState({ colProperties: newColProperties })
  }

  handleColumnToggleAll =
    (columns: utils.Column<T>[]) => (isChecked: boolean) => {
      const { colProperties } = this.state
      const newColProperties = { ...colProperties }

      for (const { key } of columns) {
        if (!newColProperties[key]) {
          newColProperties[key] = {
            ...constants.defaultHeader,
            key,
          }
        }

        newColProperties[key].invisible = isChecked
      }

      this.setState({ colProperties: newColProperties })
    }

  handleOnPageChange = (
    event: MouseEvent<HTMLElement>,
    { activePage }: { activePage: number },
  ) => {
    this.setState({ activePage })
  }

  handleSortChange(column: utils.Column<T>) {
    const { sorting } = this.state
    const { key } = column
    let dir = ''

    if (key !== sorting.key) {
      sorting.dir = ''
    }

    if (sorting.dir) {
      if (sorting.dir === constants.ORDER_ASC) {
        dir = constants.ORDER_DESC
      } else {
        dir = ''
      }
    } else {
      dir = constants.ORDER_ASC
    }

    this.setState({
      sorting: {
        key,
        dir,
      },
    })
  }

  getColumns(force = false): utils.Column<T>[] {
    const { asyncData, columns } = this.state
    const {
      data: propsData,
      dataSampling,
      headers,
      hideUnordered,
      orderedHeaders,
    } = this.props

    if (!force && !utils.isEmpty(columns)) {
      return columns
    }

    let data = propsData as T[]

    if (utils.isString(data)) {
      data = asyncData
    }

    return utils.parseDataForColumns<T>(
      data,
      headers,
      orderedHeaders,
      hideUnordered,
      dataSampling,
    )
  }

  getRows(): T[] {
    const { asyncData, colProperties, sorting } = this.state
    const { data: propsData, filterValue } = this.props

    let data = propsData as T[]

    if (utils.isString(data)) {
      data = asyncData
    }

    return utils.sortData(
      filterValue,
      colProperties,
      sorting,
      utils.parseDataForRows(data),
    )
  }

  async fetchData(): Promise<void> {
    const {
      data,
      dataKey,
      dataKeyResolver,
      dataRequestOptions: options,
    } = this.props

    if (utils.isString(data)) {
      this.setState({ isLoading: true })

      try {
        const asyncData = await utils.fetchData(data, {
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

        throw new Error(String(err))
      }
    }
  }

  renderSorting(column: utils.Column<T>): ReactNode {
    const {
      sorting: { key, dir },
    } = this.state
    let sortingIcon = 'rsdt-sortable-icon'

    if (key === column.key) {
      if (dir) {
        if (dir === constants.ORDER_ASC) {
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

  renderHeader(columns: utils.Column<T>[]): ReactNode {
    const { colProperties } = this.state
    const { sortable } = this.props
    const headers = columns.map((column) => {
      const thisColProps = colProperties[column.key]
      const showCol = !thisColProps || !thisColProps.invisible
      if (showCol) {
        return (
          <Table.HeaderCell data-column-name={column.key} key={column.key}>
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

  renderRow(columns: utils.Column<T>[], row: T, i: number): ReactNode {
    const { colProperties } = this.state
    const { withLinks, filterValue, parseBool, parseImg } = this.props

    return columns.map((column, j) => {
      const thisColProps = { ...colProperties[column.key] }
      const showCol = !thisColProps.invisible
      const transformFn = thisColProps.transform

      if (showCol) {
        return (
          <Table.Cell
            data-column-name={column.key}
            // eslint-disable-next-line react/no-array-index-key
            key={`row-${i}-column-${j}`}
          >
            {utils.isFunction(transformFn) ? (
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

  renderBody(columns: utils.Column<T>[], rows: T[]): ReactNode {
    const { perPage } = this.props
    const { activePage } = this.state
    const visibleRows = utils.sliceRowsPerPage(rows, activePage, perPage)
    const tableRows = visibleRows.map((row, idx) => (
      <Table.Row
        // eslint-disable-next-line react/no-array-index-key
        key={`row-${idx}`}
        onClick={(event: MouseEvent<HTMLElement>) =>
          this.handleRowClick(event, row, idx, rows)
        }
      >
        {this.renderRow(columns, row, idx)}
      </Table.Row>
    ))

    return <Table.Body>{tableRows}</Table.Body>
  }

  renderToggles(columns: utils.Column<T>[]): ReactNode {
    const { colProperties } = this.state
    const { withToggles } = this.props

    const togglesProps = typeof withToggles === 'object' ? withToggles : {}

    if (withToggles) {
      return (
        <ErrorBoundary>
          <Toggles<T>
            columns={columns}
            colProperties={colProperties}
            handleColumnToggle={this.handleColumnToggle}
            handleColumnToggleAll={this.handleColumnToggleAll(columns)}
            selectAll={togglesProps?.selectAll}
          />
        </ErrorBoundary>
      )
    }

    return null
  }

  renderPagination(rows: T[]): ReactNode {
    const { perPage, paginator: PaginatorComponent } = this.props
    const { activePage } = this.state
    const Paginate = withPagination<T>(PaginatorComponent)

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

  render() {
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

    if (utils.isEmpty(rows)) {
      return emptyTable
    }

    return (
      <SmartDataTableContext.Provider value={this.state}>
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
      </SmartDataTableContext.Provider>
    )
  }
}

// Defines the type of data expected in each passed prop
SmartDataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  dataKey: PropTypes.string,
  dataKeyResolver: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  dataRequestOptions: PropTypes.objectOf(PropTypes.any),
  dataSampling: PropTypes.number,
  dynamic: PropTypes.bool,
  emptyTable: PropTypes.node,
  filterValue: PropTypes.string,
  headers: PropTypes.shape({
    key: PropTypes.string,
    text: PropTypes.string,
    invisible: PropTypes.bool,
    sortable: PropTypes.bool,
    filterable: PropTypes.oneOf([PropTypes.bool, PropTypes.func]),
    isImg: PropTypes.oneOf([
      PropTypes.bool,
      PropTypes.shape({
        // eslint-disable-next-line react/forbid-prop-types
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
  withToggles: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      selectAll: togglesSelectAllPropTypes,
    }),
  ]),
}

// Defines the default values for not passing a certain prop
SmartDataTable.defaultProps = {
  className: '',
  dataKey: constants.DEFAULT_DATA_KEY,
  dataKeyResolver: null,
  dataRequestOptions: {},
  dataSampling: 0,
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
