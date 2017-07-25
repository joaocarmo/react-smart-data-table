'use strict'

// Import modules
import React from 'react'
import PropTypes from 'prop-types'
import './css/toggles.css'

class Toggles extends React.Component {
  constructor(props) {
    super(props)

    this.handleToggleClick = this.handleToggleClick.bind(this)
  }

  handleToggleClick({ target }) {
    const { handleColumnToggle } = this.props
    handleColumnToggle(target.value)
  }

  renderToggles() {
    const { columns } = this.props
    return columns.map((column, i) => (
      <span
        className='rsdt rsdt-column-toggles toggle'
        key={'toggle-' + i}>
        <input
          type='checkbox'
          id={'toggle-' + i}
          value={column.key}
          name={column.title}
          checked={column.visible}
          onChange={this.handleToggleClick}
        />
        <label htmlFor={'toggle-' + i}>{column.title}</label>
      </span>
    ));
  }

  render() {
    return (
      <div className='rsdt rsdt-column-toggles'>
        {this.renderToggles()}
      </div>
    );
  }
}

/* Defines the type of data expected in each passed prop */
Toggles.propTypes = {
  columns: PropTypes.array.isRequired,
  handleColumnToggle: PropTypes.func.isRequired
}

/* Defines the default values for not passing a certain prop */
Toggles.defaultProps = {
  columns: []
}

export default Toggles
