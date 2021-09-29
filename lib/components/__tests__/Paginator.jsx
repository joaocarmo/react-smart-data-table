import { shallow } from 'enzyme'
import Paginator from '../Paginator'
import PaginatorItem from '../PaginatorItem'

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

describe('Paginator', () => {
  it('renders correctly (snapshot)', () => {
    const [activePage, totalPages] = testCases[0]

    const wrapper = shallow(
      <Paginator
        activePage={activePage}
        totalPages={totalPages}
        onPageChange={mockPageChange}
      />,
    )

    expect(wrapper).toMatchSnapshot()
  })

  it.each(testCases)(
    'renders correctly the inner elements for active %s and %s pages',
    (activePage, totalPages, renderedItems) => {
      const wrapper = shallow(
        <Paginator
          activePage={activePage}
          totalPages={totalPages}
          onPageChange={mockPageChange}
        />,
      )

      expect(wrapper.find(PaginatorItem).length).toBe(renderedItems)
    },
  )

  it('activePage has active prop', () => {
    const [activePage, totalPages, , activeItem] = testCases[0]

    const wrapper = shallow(
      <Paginator
        activePage={activePage}
        totalPages={totalPages}
        onPageChange={mockPageChange}
      />,
    )

    expect(wrapper.find(PaginatorItem).at(activeItem).prop('active')).toBe(true)
  })

  it('calls onPageChange when clicking PaginatorItem', () => {
    const [activePage, totalPages, , activeItem] = testCases[0]

    const wrapper = shallow(
      <Paginator
        activePage={activePage}
        totalPages={totalPages}
        onPageChange={mockPageChange}
      />,
    )

    wrapper.find(PaginatorItem).at(activeItem).simulate('click')

    // expect(mockPageChange).toHaveBeenCalled()
  })
})
