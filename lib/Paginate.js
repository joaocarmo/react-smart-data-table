'use strict'

// Import modules
import React from 'react'
import PropTypes from 'prop-types'
import segmentize from 'segmentize'
import times from 'lodash/times'
import last from 'lodash/last'
import first from 'lodash/first'
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

  pageToLink(page) {
    return <a href='/' className='rsdt rsdt-paginate link' key={page} onClick={(e) => { e.preventDefault(); this.handlePageClick(null, null, null, page) }}>{page}</a>;
  }

  centerPage(page) {
    return <span className='rsdt rsdt-paginate current' key={page}>{page}</span>;
  }

  ellipsis(position) {
    return <span className='rsdt rsdt-paginate ellipsis' key={'ellipsis' + position}>&#8230;</span>;
  }

  renderInnerPages(currentPage, numPages) {
    if (numPages < 9) {
      return this.renderInnerPagesFew(currentPage, numPages);
    } else {
      var pagination = []
      const segments = segmentize({
        page: currentPage,
        pages: numPages,
        beginPages: 2,
        endPages: 2,
        sidePages: 1
      })
      segments.beginPages.forEach(page => pagination.push(this.pageToLink(page)))
      if (first(segments.previousPages) - 1 > last(segments.beginPages)) pagination.push(this.ellipsis('begin'))
      segments.previousPages.forEach(page => pagination.push(this.pageToLink(page)))
      segments.centerPage.forEach(page => pagination.push(this.centerPage(page)))
      segments.nextPages.forEach(page => pagination.push(this.pageToLink(page)))
      if (last(segments.nextPages) + 1 < first(segments.endPages)) pagination.push(this.ellipsis('end'))
      segments.endPages.forEach(page => pagination.push(this.pageToLink(page)))
      return pagination;
    }
  }

  renderInnerPagesFew(currentPage, numPages) {
    return times(numPages, (i) => {
      const page = i + 1
      if (page === currentPage) return <span className='rsdt rsdt-paginate current' key={page}>{page}</span>;
      return <a href='/' className='rsdt rsdt-paginate link' key={page} onClick={(e) => { e.preventDefault(); this.handlePageClick(null, currentPage, numPages, page) }}>{page}</a>;
    });
  }

  renderPaginate() {
    const { rows, currentPage, perPage } = this.props
    const numRows = rows.length
    const numPages = Math.ceil( numRows / perPage )
    return (
      <div className='rsdt rsdt-paginate'>
        <a href='/' className='rsdt rsdt-paginate first' onClick={(e) => { e.preventDefault(); this.handlePageClick('first', currentPage, numPages) }}>First</a>
        <a href='/' className='rsdt rsdt-paginate previous' onClick={(e) => { e.preventDefault(); this.handlePageClick('previous', currentPage, numPages) }}>Previous</a>
        {this.renderInnerPages(currentPage, numPages)}
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
