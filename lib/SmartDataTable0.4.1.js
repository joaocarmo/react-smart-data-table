'use strict'

// Import modules
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import flatten from 'flat'
import { parseHeader, parseCell, filterRowsByValue, filterVisibleRows, sliceRowsPerPage, absCol } from './functions'
import Paginate from './Paginate'
import styled from './styled.css'
import basicCSS from './basic.css'

class SmartDataTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: [],
      rows: [],
      originalRows: [],
      originalData: [],
      sortDir: null,
      currentPage: 1
    }

    this.handleColumnToggle = this.handleColumnToggle.bind(this)
    this.handleOnPageClick = this.handleOnPageClick.bind(this)
  }

  componentWillMount() {
    const { data: rawData } = this.props
    const originalData = rawData.map(m => _.isPlainObject(m) ? flatten(m) : null).filter(m => !_.isNil(m) && !_.isEmpty(m))
    const firstRow = originalData[0]
    var columns = []
    var rows = []

    if (_.isPlainObject(firstRow)) {
      _.forOwn(firstRow, (value, key) => columns.push({
          title: parseHeader(key),
          visible: true
        })
      )

      if (!_.isEmpty(originalData)) {
        rows = originalData.map(row => Object.keys(row).map(key => parseCell(row[key])))
      } else {
        console.error('Couldn\'t find Rows in the data supplied to SRDT')
      }

    } else {
      console.error('Couldn\'t find Headers in the data supplied to SRDT')
    }

    this.setState({
      columns,
      rows,
      originalRows: rows,
      originalData
    })
  }

  componentWillReceiveProps(nextProps) {
    const { originalRows } = this.state
    const { filterValue: _filterValue } = this.props
    const { filterValue } = nextProps
    if (_filterValue !== filterValue) {
      this.setState({
        rows: this.filterRows(filterValue, originalRows)
      })
    }
  }

  filterRows(value, rows) {
    if (!value) {
      return rows;
    } else {
      return filterRowsByValue(value, rows);
    }
  }

  handleColumnToggle(idx) {
    const { columns: _columns } = this.state
    var columns = _columns.slice(0)
    columns[idx].visible = !columns[idx].visible
    this.setState({ columns })
  }

  handleHeaderClick(col) {
    const { sortable, filterValue } = this.props
    if (sortable) {
      const { columns, originalRows, sortDir } = this.state
      var sortedRows = _.sortBy(originalRows, [ absCol(col, columns) ])
      var newSortDir = null
      if (sortDir === 'ASC') {
        newSortDir = 'DESC'
        _.reverse(sortedRows)
      } else if (sortDir === 'DESC') {
        newSortDir = null
        sortedRows = originalRows
      } else {
        newSortDir = 'ASC'
      }
      this.setState({
        rows: this.filterRows(filterValue, sortedRows),
        sortDir: newSortDir
      })
    }
  }

  handleOnPageClick(nextPage) {
    this.setState({ currentPage: nextPage })
  }

  renderStyledTable() {
    const { className, footer, sortable, perPage } = this.props
    const { columns, rows, currentPage } = this.state
    const headClass = sortable ? ' sortable' : ''
    const visibleColumns = columns.filter(column => column.visible)
    const visibleRows = filterVisibleRows(rows, columns)
    const slicedRows = sliceRowsPerPage(visibleRows, currentPage, perPage)
    const head = visibleColumns.map((header, i) => <div className={'rsdt cell' + headClass} key={'rsdt-header-' + i} onClick={() => this.handleHeaderClick(i)}>{header.title}</div>)
    const foot = visibleColumns.map((header, i) => <div className='rsdt cell' key={'rsdt-footer-' + i}>{header.title}</div>)
    const body = slicedRows.map((row, i) => (
        <div className='rsdt row' key={'rsdt-row-' + i}>
          {row.map((cell, j) => <div className='rsdt cell' key={'rsdt-row-' + i + '-cell-' + j}>{cell}</div>)}
        </div>
      )
    )

    return (
      <div className='rsdt table'>
        <div className='rsdt head'>
          <div className='rsdt row'>
            {head}
          </div>
        </div>
        <div className='rsdt body'>
          {body}
        </div>
        {
          footer
            ? <div className='rsdt foot'><div className='rsdt row'>{foot}</div></div>
            : null
        }
      </div>
    );
  }

  renderHTMLTable() {
    const { className, footer, sortable, perPage } = this.props
    const { columns, rows, currentPage } = this.state
    const headClass = sortable ? 'sortable' : null
    const visibleColumns = columns.filter(column => column.visible)
    const visibleRows = filterVisibleRows(rows, columns)
    const slicedRows = sliceRowsPerPage(visibleRows, currentPage, perPage)
    const head = visibleColumns.map((header, i) => <th key={'rsdt-header-' + i} className={headClass} onClick={() => this.handleHeaderClick(i)}>{header.title}</th>)
    const foot = visibleColumns.map((header, i) => <th key={'rsdt-footer-' + i}>{header.title}</th>)
    const body = slicedRows.map((row, i) => (
        <tr key={'rsdt-row-' + i}>
          {row.map((cell, j) => <td key={'rsdt-row-' + i + '-cell-' + j}>{cell}</td>)}
        </tr>
      )
    )

    return (
      <table className={className}>
        <thead>
          <tr>
            {head}
          </tr>
        </thead>
        <tbody>
          {body}
        </tbody>
        {
          footer
            ? <tfoot><tr>{foot}</tr></tfoot>
            : null
        }
      </table>
    );
  }

  renderPerPage() {
    const { rows, currentPage } = this.state
    const { perPage } = this.props
    return (
      <Paginate rows={rows} currentPage={currentPage} perPage={perPage} onPageClick={this.handleOnPageClick} />
    );
  }

  render() {
    const { columns } = this.state
    const { name, styled, withToggles, perPage, children } = this.props
    const passProps = {
      columns,
      handleColumnToggle: this.handleColumnToggle
    }

    return (
      <div>
        <div>
          {
            withToggles
              ? <div>{React.cloneElement(children, passProps)}</div>
              : null
          }
        </div>
        <div className='rsdt' data-table-name={name}>
          {
            styled
              ? this.renderStyledTable()
              : this.renderHTMLTable()
          }
        </div>
        <div>
          {
            perPage && perPage > 0
              ? this.renderPerPage()
              : null
          }
        </div>
      </div>
    )
  }
}

/* Defines the type of data expected in each passed prop */
SmartDataTable.propTypes = {
  data: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  styled: PropTypes.bool,
  basic: PropTypes.bool,
  footer: PropTypes.bool,
  sortable: PropTypes.bool,
  withToggles: PropTypes.bool,
  filterValue: PropTypes.string,
  perPage: PropTypes.number
}

/* Defines the default values for not passing a certain prop */
SmartDataTable.defaultProps = {
  data: [],
  name: 'reactsmartdatatable',
  styled: false,
  basic: false,
  footer: false,
  sortable: false,
  withToggles: false,
  filterValue: '',
  perPage: 0
}

export default SmartDataTable
