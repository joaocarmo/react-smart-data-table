import { Component, ComponentType } from 'react'
import PropTypes from 'prop-types'
import { PageChangeFn } from '../PaginatorItem'
import * as utils from '../../helpers/functions'

export interface WrappedComponentProps {
  activePage: number
  onPageChange: PageChangeFn
  totalPages: number
}

interface PaginationWrapperProps<T = utils.UnknownObject> {
  rows: T[]
  perPage: number
  activePage: number
  onPageChange: PageChangeFn
}

interface PaginationWrapperState {
  totalPages: number
}

const withPagination = <T,>(
  WrappedComponent: ComponentType<WrappedComponentProps>,
): ComponentType<PaginationWrapperProps<T>> => {
  class PaginationWrapper extends Component<
    PaginationWrapperProps<T>,
    PaginationWrapperState
  > {
    static propTypes

    static defaultProps

    constructor(props: PaginationWrapperProps<T>) {
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
    // eslint-disable-next-line react/forbid-prop-types
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    perPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    activePage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onPageChange: PropTypes.func,
  }

  PaginationWrapper.defaultProps = {
    perPage: 10,
    activePage: 1,
    onPageChange: () => null,
  }

  return PaginationWrapper
}

export default withPagination
