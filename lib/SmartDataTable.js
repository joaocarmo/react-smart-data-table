// Import modules
import React from 'react'
import PropTypes from 'prop-types'
// Import components
import ErrorBoundary from './ErrorBoundary'
import TableCell from './TableCell'
import Toggles from './Toggles'
import Paginate from './Paginate'
// Import functions
import {
  debugPrint, errorPrint, fetchData, parseDataForColumns, parseDataForRows,
  sliceRowsPerPage, sortData,
} from './functions'
// Import styles
import './css/basic.css'

class SmartDataTablePlain extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      asyncData: [],
      colProperties: {},
      sorting: {
        key: '',
        dir: '',
      },
      currentPage: 1,
      isLoading: false,
    }

    this.handleColumnToggle = this.handleColumnToggle.bind(this)
    this.handleOnPageClick = this.handleOnPageClick.bind(this)
    this.handleRowClick = this.handleRowClick.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    const { filterValue } = props
    const { prevFilterValue } = state
    if (filterValue !== prevFilterValue) {
      return {
        currentPage: 1,
        prevFilterValue: filterValue,
      }
    }
    return null
  }

  componentDidMount() {
    this.showWarnings()
    this.fetchData()
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props
    const { data: prevData } = prevProps
    if (typeof data === 'string'
    && (typeof data !== typeof prevData || data !== prevData)) {
      this.fetchData()
    }
  }

  fetchData() {
    const { data, dataKey } = this.props
    if (typeof data === 'string') {
      this.setState({ isLoading: true })
      fetchData(data, dataKey)
        .then(asyncData => this.setState({ asyncData, isLoading: false }))
        .catch(debugPrint)
    }
  }

  showWarnings() {
    const { styled } = this.props
    const styledError = '[SmartDataTable] The styled prop has been deprecated in v0.5 and is no longer valid.'
    if (styled) errorPrint(styledError)
  }

  handleRowClick(event, rowData, rowIndex, tableData) {
    const { onRowClick } = this.props
    if (onRowClick) {
      onRowClick(event, { rowData, rowIndex, tableData })
    }
  }

  handleColumnToggle(key) {
    const { colProperties } = this.state
    if (!colProperties[key]) {
      colProperties[key] = {}
    }
    colProperties[key].invisible = !colProperties[key].invisible
    this.setState({ colProperties })
  }

  handleOnPageClick(nextPage) {
    this.setState({ currentPage: nextPage })
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
    const { sorting } = this.state
    let sortingIcon = 'rsdt-sortable-icon'
    if (sorting.key === column.key) {
      if (sorting.dir) {
        if (sorting.dir === 'ASC') {
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
        role='button'
        tabIndex={0}
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
            <span>
              {column.title}
            </span>
            <span className='rsdt rsdt-sortable'>
              {sortable && column.sortable ? this.renderSorting(column) : null}
            </span>
          </th>
        )
      }
      return null
    })
    return (
      <tr>
        {headers}
      </tr>
    )
  }

  renderRow(columns, row, i) {
    const { colProperties } = this.state
    const {
      withLinks, filterValue, parseBool, parseImg,
    } = this.props
    return columns.map((column, j) => {
      const thisColProps = colProperties[column.key]
      const showCol = !thisColProps || !thisColProps.invisible
      if (showCol) {
        return (
          <td key={`row-${i}-column-${j}`}>
            <ErrorBoundary>
              <TableCell
                withLinks={withLinks}
                filterValue={filterValue}
                parseBool={parseBool}
                parseImg={parseImg}
              >
                {row[column.key]}
              </TableCell>
            </ErrorBoundary>
          </td>
        )
      }
      return null
    })
  }

  renderBody(columns, rows) {
    const { perPage } = this.props
    const { currentPage } = this.state
    const visibleRows = sliceRowsPerPage(rows, currentPage, perPage)
    const tableRows = visibleRows.map((row, i) => (
      <tr key={`row-${i}`} onClick={e => this.handleRowClick(e, row, i, rows)}>
        {this.renderRow(columns, row, i)}
      </tr>
    ))
    return (
      <tbody>
        {tableRows}
      </tbody>
    )
  }

  renderFooter(columns) {
    const { footer } = this.props
    return footer ? this.renderHeader(columns) : null
  }

  renderToggles(columns) {
    const { colProperties } = this.state
    const { withToggles } = this.props
    return withToggles ? (
      <ErrorBoundary>
        <Toggles columns={columns} colProperties={colProperties} handleColumnToggle={this.handleColumnToggle} />
      </ErrorBoundary>
    ) : null
  }

  renderPagination(rows) {
    const { perPage } = this.props
    const { currentPage } = this.state
    return perPage && perPage > 0 ? (
      <ErrorBoundary>
        <Paginate rows={rows} currentPage={currentPage} perPage={perPage} onPageClick={this.handleOnPageClick} />
      </ErrorBoundary>
    ) : null
  }

  getColumns() {
    const { asyncData } = this.state
    const { data } = this.props
    if (typeof data === 'string') {
      return parseDataForColumns(asyncData)
    }
    return parseDataForColumns(data)
  }

  getRows() {
    const { asyncData, sorting } = this.state
    const { data, filterValue } = this.props
    if (typeof data === 'string') {
      return sortData(filterValue, sorting, parseDataForRows(asyncData))
    }
    return sortData(filterValue, sorting, parseDataForRows(data))
  }

  render() {
    const {
      name, className, withHeaders, loader,
    } = this.props
    const { isLoading } = this.state
    const columns = this.getColumns()
    const rows = this.getRows()
    return !isLoading ? (
      <div className='rsdt rsdt-container'>
        {this.renderToggles(columns)}
        <table data-table-name={name} className={className}>
          {withHeaders && (
            <thead>
              {this.renderHeader(columns)}
            </thead>
          )}
          {this.renderBody(columns, rows)}
          <tfoot>
            {this.renderFooter(columns)}
          </tfoot>
        </table>
        {this.renderPagination(rows)}
      </div>
    ) : loader
  }
}

// Wrap the component with an Error Boundary
const SmartDataTable = props => (
  <ErrorBoundary>
    <SmartDataTablePlain {...props} />
  </ErrorBoundary>
)

// Defines the type of data expected in each passed prop
SmartDataTablePlain.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  dataKey: PropTypes.string,
  columns: PropTypes.array,
  name: PropTypes.string,
  footer: PropTypes.bool,
  sortable: PropTypes.bool,
  withToggles: PropTypes.bool,
  withLinks: PropTypes.bool,
  withHeaders: PropTypes.bool,
  filterValue: PropTypes.string,
  perPage: PropTypes.number,
  className: PropTypes.string,
  loader: PropTypes.node,
  onRowClick: PropTypes.func,
  parseBool: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
  parseImg: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
}

// Defines the default values for not passing a certain prop
SmartDataTablePlain.defaultProps = {
  dataKey: 'data',
  columns: [],
  name: 'reactsmartdatatable',
  footer: false,
  sortable: false,
  withToggles: false,
  withLinks: false,
  withHeaders: true,
  filterValue: '',
  perPage: 0,
  className: '',
  loader: null,
  parseBool: false,
  parseImg: false,
}

export default SmartDataTable
