# react-smart-data-table
A smart data table component for React.js meant to be configuration free

## About

This is meant to be a _zero configuration_ data table component for React.js
in the spirit of _plug and play_.

Just feed it an array of equal JSON objects and it will created a template free
table that can be customized easily with any framework.

## Installation

``` bash
$ npm install react-smart-data-table
```
## Props

| Name     | Default             | Type      | Description                               |
| :------- | :------------------ | :-------- | :---------------------------------------- |
| data     | []                  | {array}   | An array of plain objects (can be nested) |
| name     | reactsmartdatatable | {string}  | The name for the table                    |
| styled   | false               | {boolean} | Use divs instead of table tag             |
| footer   | false               | {boolean} | Copy the header to the footer             |
| sortable | false               | {boolean} | Makes the columns of the table sortable   |

## Example

``` javascript
import React from 'react'
import ReactDOM from 'react-dom'
import faker from 'faker'
import { SmartDataTable } from 'react-smart-data-table'

var testData = []
var numResults = 100
var sematicUI = 'ui compact selectable table'

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
  <SmartDataTable
    data={testData}
    name='test-table'
    className={sematicUI}
    sortable
  />,
  document.getElementById('app')
)
```
