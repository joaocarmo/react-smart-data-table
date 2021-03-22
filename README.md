# react-smart-data-table

[![npm version](https://badge.fury.io/js/react-smart-data-table.svg)][npm]
[![jest](https://jestjs.io/img/jest-badge.svg)][jest]
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)][contributor]
![Workflow Status](https://github.com/joaocarmo/react-smart-data-table/workflows/Tests/badge.svg)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/joaocarmo/react-smart-data-table.svg?logo=lgtm&logoWidth=18)][lgtm-alerts]
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/joaocarmo/react-smart-data-table.svg?logo=lgtm&logoWidth=18)][lgtm-context]

A smart data table component for React.js meant to be configuration free,
batteries included.

## About

This is meant to be a _zero configuration_ data table component for React.js
in the spirit of _plug and play_.

Just feed it an array of equal JSON objects and it will create a template free
table that can be customized easily with any framework (or custom CSS).

If you want more control over the data rendering process or don't need the
_smarts_, check out
[react-very-simple-data-table][react-very-simple-data-table].

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

| Name               | Default               | Type                  | Description                                                   |
| :----------------- | :-------------------- | :-------------------- | :------------------------------------------------------------ |
| data               | []                    | {array&#124;string}   | An array of plain objects (can be nested) or a URL            |
| dataKey            | 'data'                | {string}              | The object key where the async data is available              |
| dataKeyResolver    | _null_                | {function}            | Supply a function to extract the data from the async response |
| dataRequestOptions | {}                    | {object}              | Fetch API options passed directly into the async request call |
| dynamic            | false                 | {boolean}             | Use this if your column structure changes dynamically         |
| emptyTable         | _null_                | {element}             | Pass a renderable object to render when there is no data      |
| filterValue        | ''                    | {string}              | Filters all columns by its value                              |
| headers            | {}                    | {object}              | The object that overrides default column behavior             |
| hideUnordered      | false                 | {boolean}             | Hides all the columns not passed to _orderedHeaders_          |
| loader             | _null_                | {element}             | Element to be rendered while fetching async data              |
| name               | 'reactsmartdatatable' | {string}              | The name for the table                                        |
| onRowClick         | _undefined_           | {function}            | If present, it will execute on every row click                |
| orderedHeaders     | []                    | {array}               | An ordered array of the column keys                           |
| paginator          | _elements_            | {element}             | Pass a renderable object to handle the table pagination       |
| parseBool          | false                 | {boolean&#124;object} | When true, boolean values will be converted to Yes/No         |
| parseImg           | false                 | {boolean&#124;object} | When true, image URLs will be rendered as an _img_ tag        |
| perPage            | 0                     | {number}              | Paginates the results with the value as rows per page         |
| sortable           | false                 | {boolean}             | Makes the columns of the table sortable                       |
| withFooter         | false                 | {boolean}             | Copy the header to the footer                                 |
| withHeader         | true                  | {boolean}             | Can be used to disable the rendering of column headers        |
| withLinks          | false                 | {boolean}             | Converts e-mails and url addresses to links                   |
| withToggles        | false                 | {boolean}             | Enables the column visibility toggles                         |

### emptyTable

```jsx
// Any renderable object can be passed
const emptyTable = <div>There is no data available at the time.</div>
```

### headers

```js
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

```js
const onRowClick = (event, { rowData, rowIndex, tableData }) => {
  // The following results should be identical
  console.log(rowData, tableData[rowIndex])
}
```

### paginator

The _CustomComponent_ passed down as a prop will be rendered with the following
props which can be used to perform all the necessary calculations and makes it
fully compatible with Semantic UI's [Pagination][pagination]
component.

```jsx
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

### parseBool

```js
// Default
const parseBool = {
  yesWord: 'Yes',
  noWord: 'No',
}
```

### parseImg

```js
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

### orderedHeaders / hideUnordered

If you want to control the order of the columns, simply pass an array containing
the keys in the desired order. All the omitted headers will be appended
afterwards unpredictably. Additionally, you can pass the _hideUnordered_ in
order to render only the headers in _orderedHeaders_ and hide the remaining.

```js
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
URL and try to load the data from that location using _[fetch][fetch]_. If a
successful request is returned, the data will be extracted from the response
object. By default, it will grab the `data` key from the response. If it's in a
different key, you can specify it with the `dataKey` prop. Just in case it's
not a first-level attribute, you can supply a custom function to locate the
data using the `dataKeyResolver` prop.

`response from /api/v1/user`

```json
{
  "status": "success",
  "message": "",
  "users": [{ "id": 0, "other": "..." }, { "id": 1, "other": "..." }, "..."]
}
```

`response from /api/v1/post`

```json
{
  "status": "success",
  "message": "",
  "results": {
    "posts": [{ "id": 0, "other": "..." }, { "id": 1, "other": "..." }, "..."]
  }
}
```

`component`

```jsx
// Using `dataKey`
<SmartDataTable
  data="/api/v1/user"
  dataKey="users"
  name="test-table"
/>

// Using `dataKeyResolver`
<SmartDataTable
  data="/api/v1/post"
  dataKeyResolver={(response) => response.results.posts}
  name="test-table"
/>
```

### Simple sortable table (with Semantic UI)

```jsx
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

- [Semantic UI: All Features][semantic]
- [Bootstrap: Sortable][bootstrap]

Take a look at the full featured example's [source code][example-source].

Also, see it in full integration with a simple user/group management dashboard
application. Feel free to play around with it, it's built with hot reloading.

- [Somewhere I Belong][somewhere-i-belong]

If you want to play around, check out this [codepen][codepen].

## Forking / Contributing

If you want to fork or [contribute][contribute], it's easy to test your changes.
Just run the following development commands. The _start_ instruction will start
a development HTTP server in your computer accessible from your browser at the
address `http://localhost:3000/`.

```sh
yarn start
```

<!-- References -->

[bootstrap]: https://joaocarmo.github.io/react-smart-data-table/examples/bootstrap/
[codepen]: https://codepen.io/joaocarmo/pen/oNBNZBO
[contribute]: ./CONTRIBUTING.md
[contributor]: ./CODE_OF_CONDUCT.md
[example-source]: ./example/index.js
[fetch]: https://fetch.spec.whatwg.org/
[jest]: https://github.com/facebook/jest
[lgtm-alerts]: https://lgtm.com/projects/g/joaocarmo/react-smart-data-table/alerts/
[lgtm-context]: https://lgtm.com/projects/g/joaocarmo/react-smart-data-table/context:javascript
[npm]: https://badge.fury.io/js/react-smart-data-table
[pagination]: https://react.semantic-ui.com/addons/pagination/
[react-very-simple-data-table]: https://github.com/joaocarmo/react-very-simple-data-table
[semantic]: https://joaocarmo.github.io/react-smart-data-table/examples/semantic-ui/
[somewhere-i-belong]: https://github.com/joaocarmo/somewhere-i-belong
