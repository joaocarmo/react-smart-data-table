import React from 'react'

const { array, string } = React.PropTypes

const SmartDataTable = React.createClass({

  propTypes: {
    data: array.isRequired,
    name: string.isRequired
  },

  getDefaultProps() {
    return {
      data: [],
      name: 'smartdatatable'
    }
  },

  getInitialState() {
    return {
      data: [],
      originalData: []
    }
  },

  componentWillMount() {
    const { data } = this.props

    this.setState({
      data: data.slice(0),
      originalData: data.slice(0)
    })
  },

  render() {
    /* get the data table name */
    const { name } = this.props

    /* get the data */
    const { data } = this.state

    return (
      <div {...this.props} data-table-name={name}>
        <h3>SmartDataTable</h3>
        <pre>{JSON.stringify(data, undefined, 2)}</pre>
      </div>
    )
  }

})

export { SmartDataTable }
