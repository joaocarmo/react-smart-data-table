'use strict'

// Import modules
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import flatten from 'flat'
import { parseHeader, parseCell } from './functions'
import styled from './styled.css'
import basicCss from './basic.css'

class SmartDataTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: [],
      rows: [],
      originalRows: [],
      originalData: [],
      sortDir: null
    }
  }

  componentWillMount() {
    const { data: rawData } = this.props
    const originalData = rawData.map(m => _.isPlainObject(m) ? flatten(m) : null).filter(m => !_.isNil(m) && !_.isEmpty(m))
    const firstRow = originalData[0]
    var columns = []
    var rows = []

    if (_.isPlainObject(firstRow)) {
      _.forOwn(firstRow, (value, key) => columns.push(parseHeader(key)))

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
      return _.filter(rows, (row) => {
        const regex = new RegExp('.*?' + value + '.*?', 'i')
        var hasMatch = false
        _.forOwn(row, (val, key) => {
          hasMatch = hasMatch || regex.test(val)
        })
        return hasMatch;
      });
    }
  }

  handleHeaderClick(col) {
    const { sortable } = this.props
    if (sortable) {
      const { originalRows, sortDir } = this.state
      var sortedRows = _.sortBy(originalRows, [ col ])
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
        rows: sortedRows,
        sortDir: newSortDir
      })
    }
  }

  renderStyledTable() {
    const { className, footer, sortable } = this.props
    const { columns, rows } = this.state
    const headClass = sortable ? ' sortable' : ''
    const head = columns.map((header, i) => <div className={'rsdt cell' + headClass} key={'rsdt-header-' + i} onClick={() => this.handleHeaderClick(i)}>{header}</div>)
    const foot = columns.map((header, i) => <div className='rsdt cell' key={'rsdt-footer-' + i}>{header}</div>)
    const body = rows.map((row, i) => (
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
    const { className, footer, sortable } = this.props
    const { columns, rows } = this.state
    const headClass = sortable ? 'sortable' : null
    const head = columns.map((header, i) => <th key={'rsdt-header-' + i} className={headClass} onClick={() => this.handleHeaderClick(i)}>{header}</th>)
    const foot = columns.map((header, i) => <th key={'rsdt-footer-' + i}>{header}</th>)
    const body = rows.map((row, i) => (
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

  render() {
    /* get the data table name */
    const { name, styled } = this.props

    return (
      <div className='rsdt' data-table-name={name}>
        {
          styled
            ? this.renderStyledTable()
            : this.renderHTMLTable()
        }
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
  filterValue: PropTypes.string
}

/* Defines the default values for not passing a certain prop */
SmartDataTable.defaultProps = {
  data: [],
  name: 'reactsmartdatatable',
  styled: false,
  basic: false,
  footer: false,
  sortable: false,
  filterValue: ''
}

export default SmartDataTable
