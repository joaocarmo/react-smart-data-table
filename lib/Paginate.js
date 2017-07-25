'use strict'

// Import modules
import React from 'react'
import PropTypes from 'prop-types'
import times from 'lodash/times'
import './css/paginate.css'

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
      <div className='rsdt rsdt-paginate'>
        <a href='/' className='rsdt rsdt-paginate first' onClick={(e) => { e.preventDefault(); this.handlePageClick('first', currentPage, numPages) }}>First</a>
        <a href='/' className='rsdt rsdt-paginate previous' onClick={(e) => { e.preventDefault(); this.handlePageClick('previous', currentPage, numPages) }}>Previous</a>
        {
          times(numPages, (i) => {
            const page = i + 1
            if (page === currentPage) return <span className='rsdt rsdt-paginate current' key={page}>{page}</span>;
            return <a href='/' className='rsdt rsdt-paginate link' key={page} onClick={(e) => { e.preventDefault(); this.handlePageClick(null, currentPage, numPages, page) }}>{page}</a>;
          })
        }
        <a href='/' className='rsdt rsdt-paginate next' onClick={(e) => { e.preventDefault(); this.handlePageClick('next', currentPage, numPages) }}>Next</a>
        <a href='/' className='rsdt rsdt-paginate last' onClick={(e) => { e.preventDefault(); this.handlePageClick('last', currentPage, numPages) }}>Last</a>
      </div>
    );
  }

  render() {
    return (
      <div className='rsdt rsdt-paginate-container'>
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
