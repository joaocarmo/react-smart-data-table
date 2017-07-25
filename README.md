# react-smart-data-table
[![npm version](https://badge.fury.io/js/react-smart-data-table.svg)](https://badge.fury.io/js/react-smart-data-table)

A smart data table component for React.js meant to be configuration free

## About

This is meant to be a _zero configuration_ data table component for React.js
in the spirit of _plug and play_.

Just feed it an array of equal JSON objects and it will created a template free
table that can be customized easily with any framework.

It currently supports:
  1.  Humanized column names based on object keys
  2.  Sortable columns
  3.  Results filtering
  4.  Search term highlight in the results
  5.  Column visibility toggles
  6.  Automatic pagination

## Installation

``` bash
$ npm install --save react-smart-data-table
```
## Props

| Name        | Default             | Type      | Description                                           |
| :---------- | :------------------ | :-------- | :---------------------------------------------------- |
| data        | []                  | {array}   | An array of plain objects (can be nested)             |
| name        | reactsmartdatatable | {string}  | The name for the table                                |
| ~~styled~~  | ~~false~~           | ~~{boolean}~~ | ~~Use divs instead of table tag~~                 |
| footer      | false               | {boolean} | Copy the header to the footer                         |
| sortable    | false               | {boolean} | Makes the columns of the table sortable               |
| withToggles | false               | {boolean} | Enables the column visibility toggles                 |
| withLinks   | false               | {boolean} | Converts e-mails and url addresses to links           |
| filterValue | ''                  | {string}  | Filters all columns by its value                      |
| perPage     | 0                   | {number}  | Paginates the results with the value as rows per page |

## Examples

### Simple sortable table (with Semantic UI)

``` javascript
import React from 'react'
import ReactDOM from 'react-dom'
import faker from 'faker'
import SmartDataTable from 'react-smart-data-table'

var testData = []
var numResults = 100

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
    className='ui compact selectable table'
    sortable
  />,
  document.getElementById('app')
)
```

## Demos

You can try _react-smart-data-table_ with different UI libraries in the demo
pages below. You can experiment with different features as well.

* [Semantic UI: All Features](https://joaocarmo.github.io/react-smart-data-table/examples/semantic-ui/)
* [Bootstrap: Sortable](https://joaocarmo.github.io/react-smart-data-table/examples/bootstrap/)
