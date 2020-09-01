# react-smart-data-table

[![npm version](https://badge.fury.io/js/react-smart-data-table.svg)][1]
[![jest](https://jestjs.io/img/jest-badge.svg)][2]
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)][3]
![Workflow Status](https://github.com/joaocarmo/react-smart-data-table/workflows/Tests/badge.svg)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/joaocarmo/react-smart-data-table.svg?logo=lgtm&logoWidth=18)][4]
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/joaocarmo/react-smart-data-table.svg?logo=lgtm&logoWidth=18)][5]

A smart data table component for React.js meant to be configuration free

## About

This is meant to be a _zero configuration_ data table component for React.js
in the spirit of _plug and play_.

Just feed it an array of equal JSON objects and it will create a template free
table that can be customized easily with any framework (or custom CSS).

If you want more control over the data rendering process or don't need the
_smarts_, check out [react-very-simple-data-table][6].

## Features

It currently supports:

1. Humanized column names based on object keys
2. Sortable columns
3. Rows filtering / searchable
4. Search term highlight in the results
5. Column visibility toggles
6. Automatic pagination
7. Server-side/remote data
8. Control over row clicks
9. Smart data rendering
   - URLs and E-Mail addresses rendered as the _href_ in an _anchor_ tag
     `<a />`
   - _boolean_ value parsing to yes/no word
   - Image URLs rendered as the _src_ for an image tag `<img />`
10. Custom override if the default behavior is unwanted for some columns
11. Custom components
    - Paginator
12. Control the order of the columns
    - Using the above, it's also possible to select which columns to display

## Installation

```sh
yarn add react-smart-data-table

# or

npm install react-smart-data-table
```

There is some very basic styling you can use to get started, but since `v0.8.0`
you need to import it specifically. You can also copy the file and use it as the
basis for your own theme.

```js
// Import basic styling
import 'react-smart-data-table/dist/react-smart-data-table.css'
```

## Props

| Name           | Default             | Type                  | Description                                              |
| :------------- | :------------------ | :-------------------- | :------------------------------------------------------- |
| data           | []                  | {array&#124;string}   | An array of plain objects (can be nested) or a URL       |
| dataKey        | 'data'              | {string}              | The object key where the async data is available         |
| headers        | {}                  | {object}              | The object that overrides default column behavior        |
| name           | reactsmartdatatable | {string}              | The name for the table                                   |
| sortable       | false               | {boolean}             | Makes the columns of the table sortable                  |
| withToggles    | false               | {boolean}             | Enables the column visibility toggles                    |
| withLinks      | false               | {boolean}             | Converts e-mails and url addresses to links              |
| withHeader     | true                | {boolean}             | Can be used to disable the rendering of column headers   |
| withFooter     | false               | {boolean}             | Copy the header to the footer                            |
| filterValue    | ''                  | {string}              | Filters all columns by its value                         |
| perPage        | 0                   | {number}              | Paginates the results with the value as rows per page    |
| loader         | _null_              | {element}             | Element to be rendered while fetching async data         |
| onRowClick     | _undefined_         | {function}            | If present, it will execute on every row click           |
| parseBool      | false               | {boolean&#124;object} | When true, boolean values will be converted to Yes/No    |
| parseImg       | false               | {boolean&#124;object} | When true, image URLs will be rendered as an _img_ tag   |
| dynamic        | false               | {boolean}             | Use this if your column structure changes dynamically    |
| emptyTable     | _null_              | {element}             | Pass a renderable object to render when there is no data |
| paginator      | _elements_          | {element}             | Pass a renderable object handle table pagination         |
| orderedHeaders | []                  | {array}               | An ordered array of the column keys                      |
| hideUnordered  | false               | {boolean}             | Hides all the columns not passed to _orderedHeaders_     |

### headers

```javascript
/*
  Use the following structure to overwrite the default behavior for columns
  Undefined column keys will present the default behavior
    text:       Humanized text based on the column key name
    invisible:  Columns are visible by default
    sortable:   Columns are sortable by default
    filterable: Columns are filterable by default
    isImg:      Will force the render as an image, e.g. for dynamic URLs
    transform:  Allows the custom rendering of the cells content
                Should be a function and these are the arguments passed:
                  (value, index, row)
                The index is the position of the row as being rendered and
                not the index of the row in the original data
  Nested structures can be defined by a string-dot representation
    'key1.key2.key3.[...].key99'
*/
const headers = {
  columnKey: {
    text: 'Column 1',
    invisible: false,
    sortable: true,
    filterable: true,
  },
  'nested.columnKey': {
    text: 'Nested Column',
    invisible: false,
    sortable: true,
    filterable: true,
  },
  // If a dummy column is inserted into the data, it can be used to customize
  // the table by allowing actions per row to be implemented, for example
  tableActions: {
    text: 'Actions',
    invisible: false,
    sortable: false,
    filterable: false,
    transform: (value, index, row) => {
      // The following results should be identical
      console.log(value, row.tableActions)
      // Example of table actions: Delete row from data by row index
      return <button onClick={() => deleteRow(row)}>Delete Row</button>
    },
  },
}
```

### onRowClick()

```javascript
const onRowClick = (event, { rowData, rowIndex, tableData }) => {
  // The following results should be identical
  console.log(rowData, tableData[rowIndex])
}
```

### parseBool

```javascript
// Default
const parseBool = {
  yesWord: 'Yes',
  noWord: 'No',
}
```

### parseImg

```javascript
// You can pass a regular style object that will be passed down to <img />
// Or a Class Name
const parseImg = {
  style: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '5px',
    width: '150px',
  },
  className: 'my-custom-image-style',
}
```

### emptyTable

```javascript
// Any renderable object can be passed
const emptyTable = <div>There is no data available at the time.</div>
```

### paginator

The _CustomComponent_ passed down as a prop will be rendered with the following
props which can be used to perform all the necessary calculations and makes it
fully compatible with Semantic UI's [Pagination][7]
component.

```javascript
const CustomComponent = ({
  activePage, totalPages, onPageChange,
}) => (/* ... */)

<SmartDataTable
  // ...
  paginator={CustomComponent}
/>

// To change the page, call the onPageChange function with the next activePage

<MyCustomElement
  // ...
  onClick={e => this.onPageChange(e, { activePage: nextActivePage })}
/>
```

### orderedHeaders / hideUnordered

If you want to control the order of the columns, simply pass an array containing
the keys in the desired order. All the omitted headers will be appended
afterwards unpredictably. Additionally, you can pass the _hideUnordered_ in
order to render only the headers in _orderedHeaders_ and hide the remaining.

```javascript
const hideUnordered = true

const orderedHeaders = [
  'key1',
  'key2.subkey3',
  ...
]
```

## Examples

### Async data loading (fetch)

By passing a string to the `data` prop, the component will interpret it as an
URL and try to load the data from that location using _[fetch][8]_. If a
successful request is returned, the data will be extracted from the `data` key
in the response object. If it's in a different key, you can specify it with the
`dataKey` prop.

`response`

```json
{
  "status": "success",
  "message": "",
  "data": [{ "id": 0, "other": "..." }, { "id": 1, "other": "..." }, "..."]
}
```

`component`

```javascript
<SmartDataTable data="/api/v1/data" dataKey="data" name="test-table" />
```

### Simple sortable table (with Semantic UI)

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import faker from 'faker'
import SmartDataTable from 'react-smart-data-table'

var testData = []
var numResults = 100

for (var i = 0; i < numResults; i++) {
  testData.push({
    _id: i,
    fullName: faker.name.findName(),
    'email.address': faker.internet.email(),
    phone_number: faker.phone.phoneNumber(),
    address: {
      city: faker.address.city(),
      state: faker.address.state(),
      country: faker.address.country(),
    },
  })
}

ReactDOM.render(
  <SmartDataTable
    data={testData}
    name="test-table"
    className="ui compact selectable table"
    sortable
  />,
  document.getElementById('app'),
)
```

## Demos

You can try _react-smart-data-table_ with different UI libraries in the demo
pages below. You can experiment with different features as well.

- [Semantic UI: All Features][9]
- [Bootstrap: Sortable][10]

Take a look at the full featured example's [source code][11].

Also, see it in full integration with a simple user/group management dashboard
application. Feel free to play around with it, it's built with hot reloading.

- [Somewhere I Belong][12]

## Forking / Contributing

If you want to fork or [contribute][13], it's easy to test your changes. Just
run the following development commands. The _start_ instruction will start a
development HTTP server in your computer accessible from your browser at the
address `http://localhost:3000/`.

```sh
yarn dev && yarn start
```

[1]: https://badge.fury.io/js/react-smart-data-table
[2]: https://github.com/facebook/jest
[3]: ./CODE_OF_CONDUCT.md
[4]: https://lgtm.com/projects/g/joaocarmo/react-smart-data-table/alerts/
[5]: https://lgtm.com/projects/g/joaocarmo/react-smart-data-table/context:javascript
[6]: https://github.com/joaocarmo/react-very-simple-data-table
[7]: https://react.semantic-ui.com/addons/pagination/
[8]: https://fetch.spec.whatwg.org/
[9]: https://joaocarmo.github.io/react-smart-data-table/examples/semantic-ui/
[10]: https://joaocarmo.github.io/react-smart-data-table/examples/bootstrap/
[11]: https://github.com/joaocarmo/react-smart-data-table/blob/master/example/test.js
[12]: https://github.com/joaocarmo/somewhere-i-belong
[13]: ./CONTRIBUTING.md
