'use strict'

// Import modules
import React from 'react'
import PropTypes from 'prop-types'
import { parseDataForColumns, parseDataForRows, parseCell, filterRows } from './functions'
import './basic.css'

class SmartDataTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: [],
      rows: [],
      originalRows: [],
      sorting: {
        key: '',
        dir: ''
      },
      currentPage: 1
    }
  }

  componentWillMount() {
    const { data } = this.props
    const columns = parseDataForColumns(data)
    const rows = parseDataForRows(data)
    this.setState({
      columns,
      rows,
      originalRows: rows
    })
  }

  componentWillReceiveProps(nextProps) {
    const { originalRows } = this.state
    const { filterValue: _filterValue } = this.props
    const { filterValue } = nextProps
    if (_filterValue !== filterValue) {
      this.setState({
        rows: filterRows(filterValue, originalRows)
      })
    }
  }

  handleSortChange(column) {
    const { sorting } = this.state
    const { key } = column
    const dir = sorting.dir ? (
      sorting.dir === 'ASC' ? 'DESC' : ''
    ) : 'ASC'
    this.setState({
      sorting: {
        key,
        dir
      }
    })
  }

  renderSorting(column) {
    const { sorting } = this.state
    const sortingIcon = sorting.key === column.key ? (
      sorting.dir ? (
        sorting.dir === 'ASC' ? 'sortable-asc' : 'sortable-desc'
      ) : 'sortable-icon'
    ) : 'sortable-icon'
    return (
      <i className={'rsdt ' + sortingIcon} onClick={(e) => { this.handleSortChange(column) }} />
    );
  }

  renderHeader() {
    const { sortable } = this.props
    const { columns } = this.state
    const headers = columns.map(column => {
      if (column.visible) {
        return (
          <th key={column.key}>
            <span>{column.title}</span>
            <span className='rsdt sortable'>
              { sortable && column.sortable ? this.renderSorting(column) : null }
            </span>
          </th>
        );
      } else {
        return null;
      }
    })
    return (
      <tr>{headers}</tr>
    );
  }

  renderRow(row, i) {
    const { columns } = this.state
    return columns.map((column, j) => {
      if (column.visible) {
        return (
          <td key={'row-' + i + '-column-' + j}>
            {row[column.key]}
          </td>
        );
      } else {
        return null;
      }
    });
  }

  renderBody() {
    const { rows } = this.state
    const tableRows = rows.map((row, i) => (
      <tr key={'row-' + i}>
        {this.renderRow(row, i)}
      </tr>
    ))
    return (
      <tbody>{tableRows}</tbody>
    );
  }

  renderFooter() {
    const { footer } = this.props
    return footer ? this.renderHeader() : null;
  }

  render() {
    const { name, className } = this.props
    return (
      <table data-table-name={name} className={className}>
        <thead>
          {this.renderHeader()}
        </thead>
        {this.renderBody()}
        <tfoot>
          {this.renderFooter()}
        </tfoot>
      </table>
    );
  }
}

// Defines the type of data expected in each passed prop
SmartDataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array,
  name: PropTypes.string,
  footer: PropTypes.bool,
  sortable: PropTypes.bool,
  withToggles: PropTypes.bool,
  filterValue: PropTypes.string,
  perPage: PropTypes.number
}

// Defines the default values for not passing a certain prop
SmartDataTable.defaultProps = {
  data: [],
  columns: [],
  name: 'reactsmartdatatable',
  footer: false,
  sortable: false,
  withToggles: false,
  filterValue: '',
  perPage: 0
}

export default SmartDataTable
