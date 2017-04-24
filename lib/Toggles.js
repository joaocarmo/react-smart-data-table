'use strict'

// Import modules
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import css from './toggles.css'

class Toggles extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.handleToggleClick = this.handleToggleClick.bind(this)
  }

  handleToggleClick({ target }) {
    const { handleColumnToggle } = this.props
    handleColumnToggle(target.value)
  }

  renderToggles() {
    const { columns } = this.props
    return columns.map((column, idx) => (
      <span
        className='rsdt column-toggles toggle'
        key={'toggle-' + idx}>
        <input
          type='checkbox'
          id={'toggle-' + idx}
          value={idx}
          name={column.title}
          checked={column.visible}
          onChange={this.handleToggleClick}
        />
        <label htmlFor={'toggle-' + idx}>{column.title}</label>
      </span>
    ));
  }

  render() {
    return (
      <div className='rsdt column-toggles'>
        {this.renderToggles()}
      </div>
    );
  }
}

/* Defines the type of data expected in each passed prop */
Toggles.propTypes = {
  columns: PropTypes.array.isRequired,
  handleToggleClick: PropTypes.func
}

/* Defines the default values for not passing a certain prop */
Toggles.defaultProps = {
  columns: []
}

export default Toggles
