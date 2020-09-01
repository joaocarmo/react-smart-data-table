// Import modules
import React from 'react'
import PropTypes from 'prop-types'
// Import components
import { ErrorBoundary } from './components/ErrorBoundary'
import { Paginator } from './components/Paginator'
import { TableCell } from './components/TableCell'
import { Toggles } from './components/Toggles'
import withPagination from './components/helpers/with-pagination'
// Import functions
import {
  debugPrint,
  fetchData,
  isEmpty,
  isFunction,
  isString,
  parseDataForColumns,
  parseDataForRows,
  sliceRowsPerPage,
  sortData,
} from './helpers/functions'
// Import styles
import './css/basic.css'

class SmartDataTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      asyncData: [],
      columns: [],
      colProperties: {},
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
    this.showWarnings()
    this.fetchData()
    this.setColProperties()
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

  setColProperties() {
    const { headers } = this.props
    this.setState({ colProperties: headers })
  }

  fetchData() {
    const { data, dataKey } = this.props
    if (isString(data)) {
      this.setState({ isLoading: true })
      fetchData(data, dataKey)
        .then((asyncData) => {
          this.setState({
            asyncData,
            isLoading: false,
            columns: this.getColumns(true),
          })
        })
        .catch(debugPrint)
    }
  }

  showWarnings() {
    /* Keeping for future reference
    const { footer, withHeaders } = this.props
    const propError = (oldName, newName) => `
[SmartDataTable] The '${oldName}' prop has been deprecated in v0.6 and is no
longer valid. Consider replacing it with '${newName}'
`
    if (footer) errorPrint(propError('footer', 'withFooter'))
    if (withHeaders) errorPrint(propError('withHeaders', 'withHeader'))
    */
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

    if (key !== sorting.key) sorting.dir = ''

    if (sorting.dir) {
      if (sorting.dir === 'ASC') {
        dir = 'DESC'
      } else {
        dir = ''
      }
    } else {
      dir = 'ASC'
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
        if (dir === 'ASC') {
          sortingIcon = 'rsdt-sortable-asc'
        } else {
          sortingIcon = 'rsdt-sortable-desc'
        }
      }
    }
    return (
      <i
        className={`rsdt ${sortingIcon}`}
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
          <th key={column.key}>
            <span>{column.text}</span>
            <span className="rsdt rsdt-sortable">
              {sortable && column.sortable ? this.renderSorting(column) : null}
            </span>
          </th>
        )
      }
      return null
    })
    return <tr>{headers}</tr>
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
          <td key={`row-${i}-column-${j}`}>
            {isFunction(transformFn) ? (
              transformFn(row[column.key], i, row)
            ) : (
              <ErrorBoundary>
                <TableCell
                  withLinks={withLinks}
                  filterValue={filterValue}
                  parseBool={parseBool}
                  parseImg={parseImg}
                  filterable={thisColProps.filterable}
                  isImg={thisColProps.isImg}
                >
                  {row[column.key]}
                </TableCell>
              </ErrorBoundary>
            )}
          </td>
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
      <tr
        key={`row-${i}`}
        onClick={(e) => this.handleRowClick(e, row, i, rows)}
      >
        {this.renderRow(columns, row, i)}
      </tr>
    ))
    return <tbody>{tableRows}</tbody>
  }

  renderFooter(columns) {
    const { withFooter } = this.props
    return withFooter ? this.renderHeader(columns) : null
  }

  renderToggles(columns) {
    const { colProperties } = this.state
    const { withToggles } = this.props
    return withToggles ? (
      <ErrorBoundary>
        <Toggles
          columns={columns}
          colProperties={colProperties}
          handleColumnToggle={this.handleColumnToggle}
        />
      </ErrorBoundary>
    ) : null
  }

  renderPagination(rows) {
    const { perPage, paginator: PaginatorComponent } = this.props
    const { activePage } = this.state
    const Paginate = withPagination(PaginatorComponent)
    return perPage && perPage > 0 ? (
      <ErrorBoundary>
        <Paginate
          rows={rows}
          perPage={perPage}
          activePage={activePage}
          onPageChange={this.handleOnPageChange}
        />
      </ErrorBoundary>
    ) : null
  }

  getColumns(force = false) {
    const { asyncData, columns } = this.state
    const { data, headers, orderedHeaders, hideUnordered } = this.props
    if (!force && !isEmpty(columns)) return columns
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
      name,
      className,
      withHeader,
      loader,
      dynamic,
      emptyTable,
    } = this.props
    const { isLoading } = this.state
    const columns = this.getColumns(dynamic)
    const rows = this.getRows()
    if (isEmpty(rows)) return emptyTable
    return !isLoading ? (
      <div className="rsdt rsdt-container">
        {this.renderToggles(columns)}
        <table data-table-name={name} className={className}>
          {withHeader && <thead>{this.renderHeader(columns)}</thead>}
          {this.renderBody(columns, rows)}
          <tfoot>{this.renderFooter(columns)}</tfoot>
        </table>
        {this.renderPagination(rows)}
      </div>
    ) : (
      loader
    )
  }
}

// Defines the type of data expected in each passed prop
SmartDataTable.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  dataKey: PropTypes.string,
  columns: PropTypes.array,
  name: PropTypes.string,
  sortable: PropTypes.bool,
  withToggles: PropTypes.bool,
  withLinks: PropTypes.bool,
  withHeader: PropTypes.bool,
  withFooter: PropTypes.bool,
  filterValue: PropTypes.string,
  perPage: PropTypes.number,
  className: PropTypes.string,
  loader: PropTypes.node,
  onRowClick: PropTypes.func,
  parseBool: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  parseImg: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  headers: PropTypes.object,
  dynamic: PropTypes.bool,
  emptyTable: PropTypes.node,
  paginator: PropTypes.func,
  orderedHeaders: PropTypes.array,
  hideUnordered: PropTypes.bool,
}

// Defines the default values for not passing a certain prop
SmartDataTable.defaultProps = {
  dataKey: 'data',
  columns: [],
  name: 'reactsmartdatatable',
  sortable: false,
  withToggles: false,
  withLinks: false,
  withHeader: true,
  withFooter: false,
  filterValue: '',
  perPage: 0,
  className: '',
  loader: null,
  parseBool: false,
  parseImg: false,
  headers: {},
  dynamic: false,
  emptyTable: null,
  paginator: Paginator,
  orderedHeaders: [],
  hideUnordered: false,
}

export { SmartDataTable }
