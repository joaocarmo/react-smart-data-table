'use strict'

// Import modules
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import css from './paginate.css'

class Paginate extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  handlePageClick(action, currentPage, numPages, nextPage) {
    const { onPageClick } = this.props
    var _nextPage
    switch (action) {
      case 'first':
        _nextPage = 1
        break
      case 'previous':
        _nextPage = currentPage - 1 < 1 ? 1 : currentPage - 1
        break
      case 'next':
        _nextPage = currentPage + 1 > numPages ? numPages : currentPage + 1
        break
      case 'last':
        _nextPage = numPages
        break
    }
    onPageClick(nextPage || _nextPage)
  }

  renderPaginate() {
    const { rows, currentPage, perPage } = this.props
    const numRows = rows.length
    const numPages = Math.ceil( numRows / perPage )
    return (
      <div className='rsdt paginate'>
        <span className='rsdt paginate first' onClick={() => this.handlePageClick('first', currentPage, numPages)}>First</span>
        <span className='rsdt paginate previous' onClick={() => this.handlePageClick('previous', currentPage, numPages)}>Previous</span>
        {
          _.times(numPages, (i) => {
            const page = i + 1
            if (page === currentPage) return <span className='rsdt paginate current' key={page}>{page}</span>;
            return <span className='rsdt paginate link' key={page} onClick={() => this.handlePageClick(null, currentPage, numPages, page)}>{page}</span>;
          })
        }
        <span className='rsdt paginate next' onClick={() => this.handlePageClick('next', currentPage, numPages)}>Next</span>
        <span className='rsdt paginate last' onClick={() => this.handlePageClick('last', currentPage, numPages)}>Last</span>
      </div>
    );
  }

  render() {
    return (
      <div className='rsdt paginate-container'>
        {this.renderPaginate()}
      </div>
    );
  }
}

/* Defines the type of data expected in each passed prop */
Paginate.propTypes = {
  rows: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  onPageClick: PropTypes.func.isRequired
}

/* Defines the default values for not passing a certain prop */
Paginate.defaultProps = {}

export default Paginate
