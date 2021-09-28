import { shallow } from 'enzyme'
import Paginator from '../Paginator'

describe('Paginator', () => {
  it('renders correctly (snapshot)', () => {
    const onPageChange = jest.fn()

    const wrapper = shallow(
      <Paginator activePage={3} totalPages={10} onPageChange={onPageChange} />,
    )

    expect(wrapper).toMatchSnapshot()
  })
})
