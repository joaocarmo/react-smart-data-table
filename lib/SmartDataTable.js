// Import modules
import React from 'react'
import PropTypes from 'prop-types'
import sortBy from 'lodash/sortBy'
import reverse from 'lodash/reverse'
import findIndex from 'lodash/findIndex'
// Import components
import ErrorBoundary from './ErrorBoundary'
import TableCell from './TableCell'
import Toggles from './Toggles'
import Paginate from './Paginate'
// Import functions
import {
  fetchData, parseDataForColumns, parseDataForRows, filterRows,
  sliceRowsPerPage,
} from './functions'
// Import styles
import './css/basic.css'

class SmartDataTablePlain extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: [],
      rows: [],
      originalRows: [],
      sorting: {
        key: '',
        dir: '',
      },
      currentPage: 1,
      isLoading: false,
    }

    this.handleColumnToggle = this.handleColumnToggle.bind(this)
    this.handleOnPageClick = this.handleOnPageClick.bind(this)
  }

  componentWillMount() {
    const _this = this
    const { data, dataKey } = this.props
    this.setState({ isLoading: true })
    fetchData(data, dataKey).then((_data) => {
      const columns = parseDataForColumns(_data)
      const rows = parseDataForRows(_data)
      _this.setState({
        columns,
        rows,
        originalRows: rows,
        isLoading: false,
      })
    }).catch((reason) => {
      _this.setState({ isLoading: false })
      console.error(`[SmartDataTable] ${reason}`)
    })
    this.showWarnings()
  }

  componentWillReceiveProps(nextProps) {
    const { originalRows } = this.state
    const { filterValue: _filterValue } = this.props
    const { filterValue } = nextProps
    if (_filterValue !== filterValue) {
      this.setState({
        rows: filterRows(filterValue, originalRows),
      })
    }
  }

  showWarnings() {
    const { styled } = this.props
    const styledError = '[SmartDataTable] The styled prop has been deprecated in v0.5 and is no longer valid.'
    if (styled) console.error(styledError)
  }

  handleColumnToggle(key) {
    const { columns } = this.state
    const idx = findIndex(columns, { key })
    const newColumns = columns.slice(0)
    newColumns[idx].visible = !newColumns[idx].visible
    this.setState({ columns: newColumns })
  }

  handleOnPageClick(nextPage) {
    this.setState({ currentPage: nextPage })
  }

  handleSortChange(column) {
    const { filterValue } = this.props
    const { originalRows, sorting } = this.state
    const { key } = column
    let dir = ''
    let sortedRows = []
    if (key !== sorting.key) sorting.dir = ''
    if (sorting.dir) {
      if (sorting.dir === 'ASC') {
        dir = 'DESC'
        sortedRows = reverse(sortBy(originalRows, [key]))
      } else {
        dir = ''
        sortedRows = originalRows
      }
    } else {
      dir = 'ASC'
      sortedRows = sortBy(originalRows, [key])
    }
    this.setState({
      rows: filterRows(filterValue, sortedRows),
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

  renderHeader() {
    const { sortable } = this.props
    const { columns } = this.state
    const headers = columns.map((column) => {
      if (column.visible) {
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

  renderRow(row, i) {
    const { withLinks, filterValue } = this.props
    const { columns } = this.state
    return columns.map((column, j) => {
      if (column.visible) {
        return (
          <td key={`row-${i}-column-${j}`}>
            <ErrorBoundary>
              <TableCell withLinks={withLinks} filterValue={filterValue}>
                {row[column.key]}
              </TableCell>
            </ErrorBoundary>
          </td>
        )
      }
      return null
    })
  }

  renderBody() {
    const { perPage } = this.props
    const { rows, currentPage } = this.state
    const visibleRows = sliceRowsPerPage(rows, currentPage, perPage)
    const tableRows = visibleRows.map((row, i) => (
      <tr key={`row-${i}`}>
        {this.renderRow(row, i)}
      </tr>
    ))
    return (
      <tbody>
        {tableRows}
      </tbody>
    )
  }

  renderFooter() {
    const { footer } = this.props
    return footer ? this.renderHeader() : null
  }

  renderToggles() {
    const { withToggles } = this.props
    const { columns } = this.state
    return withToggles ? (
      <ErrorBoundary>
        <Toggles columns={columns} handleColumnToggle={this.handleColumnToggle} />
      </ErrorBoundary>
    ) : null
  }

  renderPagination() {
    const { perPage } = this.props
    const { rows, currentPage } = this.state
    return perPage && perPage > 0 ? (
      <ErrorBoundary>
        <Paginate rows={rows} currentPage={currentPage} perPage={perPage} onPageClick={this.handleOnPageClick} />
      </ErrorBoundary>
    ) : null
  }

  render() {
    const {
      name, className, withHeaders, loader,
    } = this.props
    const { isLoading } = this.state
    return !isLoading ? (
      <div className='rsdt rsdt-container'>
        {this.renderToggles()}
        <table data-table-name={name} className={className}>
          {withHeaders && (
            <thead>
              {this.renderHeader()}
            </thead>
          )}
          {this.renderBody()}
          <tfoot>
            {this.renderFooter()}
          </tfoot>
        </table>
        {this.renderPagination()}
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
  loader: PropTypes.element,
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
}

export default SmartDataTable
