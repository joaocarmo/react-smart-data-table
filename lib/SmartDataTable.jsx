import { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'clsx'
import CellValue from './components/CellValue'
import ErrorBoundary from './components/ErrorBoundary'
import Paginator from './components/Paginator'
import Table from './components/Table'
import Toggles from './components/Toggles'
import withPagination from './components/helpers/with-pagination'
import {
  fetchData,
  isEmpty,
  isFunction,
  isString,
  parseDataForColumns,
  parseDataForRows,
  sliceRowsPerPage,
  sortData,
} from './helpers/functions'
import { DEFAULT_DATA_KEY, ORDER_ASC, ORDER_DESC } from './helpers/constants'
import './css/basic.css'

class SmartDataTable extends Component {
  constructor(props) {
    super(props)

    const { headers: colProperties = {} } = props

    this.state = {
      asyncData: [],
      columns: [],
      colProperties,
      sorting: {
        key: '',
        dir: '',
      },
      activePage: 1,
      isLoading: false,
    }

    this.handleColumnToggle = this.handleColumnToggle.bind(this)
    this.handleOnPageChange = this.handleOnPageChange.bind(this)
    this.handleRowClick = this.handleRowClick.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    const { filterValue } = props
    const { prevFilterValue } = state

    if (filterValue !== prevFilterValue) {
      return {
        activePage: 1,
        prevFilterValue: filterValue,
      }
    }

    return null
  }

  componentDidMount() {
    this.fetchData()
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props
    const { data: prevData } = prevProps

    if (
      isString(data) &&
      (typeof data !== typeof prevData || data !== prevData)
    ) {
      this.fetchData()
    }
  }

  async fetchData() {
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

  handleRowClick(event, rowData, rowIndex, tableData) {
    const { onRowClick } = this.props

    if (onRowClick) {
      onRowClick(event, { rowData, rowIndex, tableData })
    }
  }

  handleColumnToggle(key) {
    const { colProperties } = this.state
    const newColProperties = { ...colProperties }

    if (!newColProperties[key]) {
      newColProperties[key] = {}
    }

    newColProperties[key].invisible = !newColProperties[key].invisible

    this.setState({ colProperties: newColProperties })
  }

  handleOnPageChange(event, { activePage }) {
    this.setState({ activePage })
  }

  handleSortChange(column) {
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

  renderSorting(column) {
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

  renderHeader(columns) {
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

  renderRow(columns, row, i) {
    const { colProperties } = this.state
    const { withLinks, filterValue, parseBool, parseImg } = this.props

    return columns.map((column, j) => {
      const thisColProps = { ...colProperties[column.key] }
      const showCol = !thisColProps.invisible
      const transformFn = thisColProps.transform

      if (showCol) {
        return (
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

  renderBody(columns, rows) {
    const { perPage } = this.props
    const { activePage } = this.state
    const visibleRows = sliceRowsPerPage(rows, activePage, perPage)
    const tableRows = visibleRows.map((row, i) => (
      <Table.Row
        key={`row-${i}`}
        onClick={(e) => this.handleRowClick(e, row, i, rows)}
      >
        {this.renderRow(columns, row, i)}
      </Table.Row>
    ))

    return <Table.Body>{tableRows}</Table.Body>
  }

  renderToggles(columns) {
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

  renderPagination(rows) {
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

  getColumns(force = false) {
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

    return parseDataForColumns(data, headers, orderedHeaders, hideUnordered)
  }

  getRows() {
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

    return sortData(filterValue, colProperties, sorting, parseDataForRows(data))
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
  columns: PropTypes.array,
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  dataKey: PropTypes.string,
  dataKeyResolver: PropTypes.func,
  dataRequestOptions: PropTypes.object,
  dynamic: PropTypes.bool,
  emptyTable: PropTypes.node,
  filterValue: PropTypes.string,
  headers: PropTypes.object,
  hideUnordered: PropTypes.bool,
  loader: PropTypes.node,
  name: PropTypes.string,
  onRowClick: PropTypes.func,
  orderedHeaders: PropTypes.array,
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
  columns: [],
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
