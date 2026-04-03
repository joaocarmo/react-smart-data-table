import { Component, ComponentType } from 'react'
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
    static defaultProps: PaginationWrapperProps<T> = {
      rows: [],
      perPage: 10,
      activePage: 1,
      onPageChange: () => null,
    }

    constructor(props: PaginationWrapperProps<T>) {
      super(props)

      const { rows, perPage } = props
      this.state = { totalPages: Math.ceil(rows.length / +perPage) }
    }

    render() {
      const { activePage, onPageChange } = this.props
      const { totalPages } = this.state

      if (!totalPages) {
        return null
      }

      return (
        <WrappedComponent
          totalPages={totalPages}
          activePage={+activePage}
          onPageChange={onPageChange}
        />
      )
    }
  }

  return PaginationWrapper
}

export default withPagination
