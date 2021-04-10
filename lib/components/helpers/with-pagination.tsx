import { Component, ComponentType } from 'react'
import PropTypes from 'prop-types'
import { PageChangeFn } from '../PaginatorItem'
import { UnknownObject } from '../../helpers/functions'

export interface WrappedComponentProps {
  totalPages: number
  activePage: number
  onPageChange: PageChangeFn
}

interface PaginationWrapperProps {
  rows: UnknownObject[]
  perPage: number
  activePage: number
  onPageChange: PageChangeFn
}

interface PaginationWrapperState {
  totalPages: number
}

const withPagination = (
  WrappedComponent: ComponentType<WrappedComponentProps>,
): ComponentType => {
  class PaginationWrapper extends Component<
    PaginationWrapperProps,
    PaginationWrapperState
  > {
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
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    perPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    activePage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onPageChange: PropTypes.func.isRequired,
  }

  PaginationWrapper.defaultProps = {
    perPage: 10,
    activePage: 1,
  }

  return PaginationWrapper
}

export default withPagination
