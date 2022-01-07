import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Paginator from '../Paginator'
import type { PaginatorProps } from '../Paginator'

const mockPageChange = jest.fn()

const testCases = [
  // activePage, totalPages, renderedItems, activeItem
  [3, 10, 10, 4],
  [1, 1, 5],
  [1, 2, 6],
  [1, 3, 7],
  [1, 4, 8],
  [1, 5, 9],
  [2, 5, 9],
  [3, 5, 9],
  [1, 6, 8],
  [2, 6, 9],
  [3, 6, 10],
  [4, 6, 10],
  [1, 7, 8],
  [2, 7, 9],
  [3, 7, 10],
  [4, 7, 11],
  [5, 7, 10],
  [6, 7, 9],
  [7, 7, 8],
  [1, 8, 8],
  [1, 9, 8],
  [1, 10, 8],
  [1, 20, 8],
  [1, 100, 8],
  [2, 100, 9],
  [3, 100, 10],
  [4, 100, 11],
  [5, 100, 11],
  [50, 100, 11],
  [500, 1000, 11],
  [5000, 10000, 11],
  [97, 100, 11],
  [98, 100, 10],
  [99, 100, 9],
  [100, 100, 8],
]

const setup = ({ activePage, totalPages, onPageChange }: PaginatorProps) => {
  const utils = render(
    <Paginator
      activePage={activePage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />,
  )

  return {
    ...utils,
  }
}

describe('Paginator', () => {
  it.each(testCases)(
    'renders correctly the inner elements for active %s and %s pages',
    (activePage, totalPages, renderedItems) => {
      setup({ activePage, totalPages, onPageChange: mockPageChange })

      expect(screen.getAllByTestId('paginator-item').length).toBe(renderedItems)
    },
  )

  it('activePage has active prop', () => {
    const [activePage, totalPages, , activeItem] = testCases[0]

    setup({ activePage, totalPages, onPageChange: mockPageChange })

    expect(screen.getAllByTestId('paginator-item')[activeItem]).toHaveClass(
      'active',
    )
  })

  it('calls onPageChange when clicking PaginatorItem', () => {
    const [activePage, totalPages, , activeItem] = testCases[0]

    setup({ activePage, totalPages, onPageChange: mockPageChange })

    userEvent.click(screen.getAllByTestId('paginator-item')[activeItem])

    expect(mockPageChange).toHaveBeenCalled()
  })
})
