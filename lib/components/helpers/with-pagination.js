// Import modules
import React from 'react'
import PropTypes from 'prop-types'

const withPagination = (WrappedComponent) => {
  class PaginationWrapper extends React.Component {
    constructor(props) {
      super(props)

      this.state = { totalPages: 0 }
    }

    componentDidMount() {
      const { rows, perPage } = this.props
      const totalPages = Math.ceil(rows.length / +perPage)
      this.setState({ totalPages })
    }

    render() {
      const { activePage, onPageChange } = this.props
      const { totalPages } = this.state
      return totalPages ? (
        <WrappedComponent
          totalPages={totalPages}
          activePage={+activePage}
          onPageChange={onPageChange}
        />
      ) : null
    }
  }

  PaginationWrapper.propTypes = {
    rows: PropTypes.array.isRequired,
    perPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    activePage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onPageChange: PropTypes.func,
  }

  PaginationWrapper.defaultProps = {
    perPage: 10,
    activePage: 1,
  }

  return PaginationWrapper
}

export default withPagination
