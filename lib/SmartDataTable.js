import React from 'react'
import flatten from 'flat'
import { parseHeader, parseCell } from './functions'
import styled from './styled.css'

const { array, bool, string } = React.PropTypes

class SmartDataTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: [],
      data: [],
      originalData: []
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
        console.error('couldn\'t find rows in the data')
      }

    } else {
      console.error('couldn\'t find headers in the data')
    }

    this.setState({
      columns,
      rows,
      originalData
    })
  }

  renderStyledTable() {
    const { className, footer } = this.props
    const { columns, rows } = this.state
    const head = columns.map((header, i) => <div className='rsdt cell' key={'rsdt-header-' + i}>{header}</div>)
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
    const { className, footer } = this.props
    const { columns, rows } = this.state
    const head = columns.map((header, i) => <th key={'rsdt-header-' + i}>{header}</th>)
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
  data: array.isRequired,
  name: string.isRequired,
  styled: bool,
  basic: bool,
  footer: bool
}

/* Defines the default values for not passing a certain prop */
SmartDataTable.defaultProps = {
  data: [],
  name: 'reactsmartdatatable',
  styled: false,
  basic: false,
  footer: false
}

export { SmartDataTable }
