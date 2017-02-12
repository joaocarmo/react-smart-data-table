import React from 'react'
import ReactDOM from 'react-dom'
import faker from 'faker'
import { SmartDataTable } from './index'

var testData = []
var numResults = 100

for (var i=0; i<numResults; i++) {
  testData.push({
    id: i,
    name: faker.name.findName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    city: faker.address.city(),
    state: faker.address.state(),
    country: faker.address.country(),
  })
}

ReactDOM.render(
  <SmartDataTable data={testData} name='test-table' />,
  document.getElementById('app')
)
