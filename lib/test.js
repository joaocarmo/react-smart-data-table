import React from 'react'
import ReactDOM from 'react-dom'
import faker from 'faker'
import { SmartDataTable } from './index'

var testData = [ {} ]
var numResults = 100
var sematicUI = 'ui compact selectable table'
//var bootstrapUI = 'table table-condensed table-hover'

for (var i=0; i<numResults; i++) {
  testData.push({
    _id: i,
    fullName: faker.name.findName(),
    'email.address': faker.internet.email(),
    phone_number: faker.phone.phoneNumber(),
    address: {
      city: faker.address.city(),
      state: faker.address.state(),
      country: faker.address.country()
    }
  })
}

ReactDOM.render(
  <SmartDataTable data={testData} name='test-table' className={sematicUI} sortable />,
  document.getElementById('app')
)
