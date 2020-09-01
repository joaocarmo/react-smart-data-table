// Test 'Paginator' component
import React from 'react'
import { mount } from 'enzyme'
import { Paginator } from '../Paginator'

test("'Paginator' component (snapshot)", () => {
  const wrap = mount(<Paginator activePage={3} totalPages={10} />)
  expect(wrap).toMatchSnapshot()
})
