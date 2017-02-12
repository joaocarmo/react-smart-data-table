import React from 'react'
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
    const { data } = this.props
    var columns = []
    var rows = []

    if (typeof data[0] === 'object') {
      columns = Object.keys(data[0]).map(value => parseHeader(value))

      if (data.length > 0) {
        rows = data.map(row =>
          Object.keys(row).map(key => parseCell(row[key]))
        )
      } else {
        console.log('couldn\'t find rows in the data')
      }

    } else {
      console.log('couldn\'t find headers in the data')
    }

    this.setState({
      columns,
      rows,
      originalData: data.slice(0)
    })
  }

  renderStyledTable() {
    const { className, footer } = this.props
    const { columns, rows } = this.state
    const head = columns.map((header, i) => <div className='rsdt cell' key={'header-' + i}>{header}</div>)
    const body = rows.map((row, i) => (
        <div className='rsdt row' key={'row-' + i}>
          {row.map((cell, j) => <div className='rsdt cell' key={'row-' + i + '-cell-' + j}>{cell}</div>)}
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
            ? <div className='rsdt foot'><div className='rsdt row'>{head}</div></div>
            : null
        }
      </div>
    );
  }

  renderHTMLTable() {
    const { className, footer } = this.props
    const { columns, rows } = this.state
    const head = columns.map((header, i) => <th key={'header-' + i}>{header}</th>)
    const body = rows.map((row, i) => (
        <tr key={'row-' + i}>
          {row.map((cell, j) => <td key={'row-' + i + '-cell-' + j}>{cell}</td>)}
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
            ? <tfoot><tr>{head}</tr></tfoot>
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
