import { Component, ComponentType } from 'react'
import PropTypes from 'prop-types'
import { PageChangeFn } from '../PaginatorItem'
import { UnknownObject } from '../../helpers/functions'

export interface WrappedComponentProps {
  activePage: number
  onPageChange: PageChangeFn
  totalPages: number
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
): ComponentType<PaginationWrapperProps> => {
  class PaginationWrapper extends Component<
    PaginationWrapperProps,
    PaginationWrapperState
  > {
    static propTypes: unknown

    static defaultProps: unknown

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
