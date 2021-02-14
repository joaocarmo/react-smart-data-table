import React from 'react'
import ReactDOM from 'react-dom'
import faker from 'faker'
import { imgb64 } from '../lib/helpers/tests'
import SmartDataTable from '../lib'

const sematicUI = {
  segment: 'ui segment',
  message: 'ui message',
  labeledInput: 'ui right labeled input',
  iconInput: 'ui icon input',
  searchIcon: 'search icon',
  rowsIcon: 'numbered list icon',
  table: 'ui compact selectable table',
  select: 'ui dropdown',
  refresh: 'ui labeled primary icon button',
  refreshIcon: 'sync alternate icon',
  change: 'ui labeled secondary icon button',
  changeIcon: 'exchange icon',
  checkbox: 'ui toggle checkbox',
  loader: 'ui active text loader',
  deleteIcon: 'trash red icon',
}

const apiDataUrls = [
  'https://jsonplaceholder.typicode.com/users',
  'https://jsonplaceholder.typicode.com/todos',
  'https://jsonplaceholder.typicode.com/albums',
  'https://jsonplaceholder.typicode.com/photos',
]

const generateData = (numResults = 0) => {
  let total = numResults || 0
  if (typeof numResults === 'string') {
    total = parseInt(numResults, 10)
  }
  const data = []
  for (let i = 0; i < total; i += 1) {
    data.push({
      _id: i,
      address: {
        city: faker.address.city(),
        state: faker.address.state(),
        country: faker.address.country(),
      },
      url: faker.internet.url(),
      isMarried: faker.random.boolean(),
      actions: null,
      avatar: faker.random.boolean() ? faker.image.avatar() : imgb64,
      fullName: faker.name.findName(),
      _username: faker.internet.userName(),
      password_: faker.internet.password(),
      'email.address': faker.internet.email(),
      phone_number: faker.phone.phoneNumber(),
    })
  }
  return data
}

class AppDemo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      useApi: false,
      apiData: '',
      apiIdx: -1,
      numResults: 10,
      data: [],
      filterValue: '',
      perPage: 0,
      showOnRowClick: true,
      changeOrder: false,
      orderedHeaders: [
        '_id',
        'avatar',
        'fullName',
        '_username',
        'password_',
        'email.address',
        'phone_number',
        'address.city',
        'address.state',
        'address.country',
        'url',
        'isMarried',
        'actions',
      ],
      hideUnordered: false,
    }

    this.setNewData = this.setNewData.bind(this)
    this.setApiData = this.setApiData.bind(this)
    this.changeData = this.changeData.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnPerPage = this.handleOnPerPage.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.onRowClick = this.onRowClick.bind(this)
    this.handleOnChangeOrder = this.handleOnChangeOrder.bind(this)
  }

  componentDidMount() {
    const { numResults } = this.state
    this.setNewData(numResults)
    this.setApiData()
  }

  setNewData() {
    const { numResults } = this.state
    this.setState({
      data: generateData(numResults),
    })
  }

  setApiData() {
    let { apiIdx } = this.state
    const N = apiDataUrls.length
    apiIdx += 1
    if (apiIdx === N) apiIdx -= N
    const apiData = apiDataUrls[apiIdx]
    this.setState({ apiData, apiIdx })
  }

  handleDelete(event, idx, row) {
    event.preventDefault()
    event.stopPropagation()
    const { data } = this.state
    const { _id, id } = row
    let orgInd
    if (_id) orgInd = data.findIndex(({ _id: thisId }) => thisId === _id)
    if (id) orgInd = data.findIndex(({ id: thisId }) => thisId === id)
    data.splice(orgInd, 1)
    this.setState({ data })
  }

  getHeaders() {
    return {
      id: {
        text: 'Identifier',
        invisible: true,
        filterable: false,
        transform: (value) => `Row #${value}`,
      },
      _id: {
        text: 'Identifier',
        invisible: true,
        filterable: false,
        transform: (value) => `Row #${value + 1}`,
      },
      avatar: {
        text: 'Profile Pic',
        sortable: false,
        filterable: false,
      },
      _username: {
        invisible: true,
      },
      password_: {
        invisible: true,
      },
      'address.city': {
        text: 'City',
      },
      'address.state': {
        text: 'State',
      },
      'address.country': {
        text: 'Country',
      },
      url: {
        text: 'Web Page',
        sortable: false,
        filterable: false,
      },
      actions: {
        text: 'Actions',
        sortable: false,
        filterable: false,
        transform: (value, idx, row) => (
          <i
            className={sematicUI.deleteIcon}
            style={{ cursor: 'pointer' }}
            onClick={(e) => this.handleDelete(e, idx, row)}
            onKeyDown={(e) => this.handleDelete(e, idx, row)}
            role='button'
            tabIndex='0'
            aria-label='delete row'
          />
        ),
      },
      thumbnailUrl: {
        text: 'Thumbnail',
        sortable: false,
        filterable: false,
        isImg: true,
      },
    }
  }

  handleOnChange({ target: { name, value } }) {
    this.setState({ [name]: value }, () => {
      if (name === 'numResults') this.setNewData()
    })
  }

  handleOnChangeOrder(now, next) {
    const { orderedHeaders } = this.state
    const N = orderedHeaders.length
    let nextPos = next
    if (next < 0) {
      nextPos = N
    }
    if (next >= N) {
      nextPos = 0
    }
    const newOrderedHeaders = [...orderedHeaders]
    const mvElement = newOrderedHeaders.splice(now, 1)[0]
    newOrderedHeaders.splice(nextPos, 0, mvElement)
    this.setState({ orderedHeaders: newOrderedHeaders })
  }

  handleOnPerPage({ target: { name, value } }) {
    this.setState({ [name]: parseInt(value, 10) })
  }

  changeData() {
    const { useApi } = this.state
    this.setState({
      useApi: !useApi,
      filterValue: '',
      perPage: 0,
    })
  }

  handleCheckboxChange({ target: { name, checked } }) {
    this.setState({ [name]: checked })
  }

  onRowClick(event, { rowData, rowIndex, tableData }) {
    const { showOnRowClick } = this.state
    if (showOnRowClick) {
      const { fullName, name, id } = rowData
      let value = fullName || name || id
      if (!value) {
        const [key] = Object.keys(rowData)
        value = `${key}: ${rowData[key]}`
      }
      /* eslint-disable no-alert */
      window.alert(`You clicked ${value}'s row !`)
    } else {
      // The following results should be identical
      /* eslint-disable no-console */
      console.log(rowData, tableData[rowIndex])
    }
  }

  render() {
    const {
      useApi, apiData, data, filterValue, perPage, numResults, showOnRowClick,
      changeOrder, orderedHeaders, hideUnordered,
    } = this.state
    const divider = <span style={{ display: 'inline-block', margin: '10px' }} />
    const headers = this.getHeaders()
    return (
      <>
        <div className={sematicUI.segment}>
          <div className={sematicUI.iconInput}>
            <input
              type='text'
              name='filterValue'
              value={filterValue}
              placeholder='Filter results...'
              onChange={this.handleOnChange}
            />
            <i className={sematicUI.searchIcon} />
          </div>
          {divider}
          <select
            name='perPage'
            value={perPage}
            className={sematicUI.select}
            onChange={this.handleOnPerPage}
          >
            <option value='0'>
              Per Page
            </option>
            <option value='10'>
              10
            </option>
            <option value='25'>
              25
            </option>
            <option value='50'>
              50
            </option>
            <option value='100'>
              100
            </option>
          </select>
          {divider}
          {!useApi && (
            <button type='button' className={sematicUI.refresh} onClick={this.setNewData}>
              <i className={sematicUI.refreshIcon} />
              Refresh Faker
            </button>
          )}
          {useApi && (
            <button type='button' className={sematicUI.refresh} onClick={this.setApiData}>
              <i className={sematicUI.refreshIcon} />
              New API URL
            </button>
          )}
          {divider}
          <button type='button' className={sematicUI.change} onClick={this.changeData}>
            <i className={sematicUI.changeIcon} />
            {useApi ? 'Use Faker' : 'Use Async API'}
          </button>
          {!useApi && (
            <span>
              {divider}
              <div className={sematicUI.iconInput}>
                <input
                  type='text'
                  name='numResults'
                  value={numResults}
                  placeholder='# Rows'
                  onChange={this.handleOnChange}
                  style={{ width: '80px' }}
                />
                <i className={sematicUI.rowsIcon} />
              </div>
            </span>
          )}
          {divider}
          <div className={sematicUI.checkbox}>
            <input
              type='checkbox'
              name='showOnRowClick'
              onChange={this.handleCheckboxChange}
              checked={showOnRowClick}
            />
            <label>
              Show alert on row click
            </label>
          </div>
          {divider}
          <div className={sematicUI.checkbox}>
            <input
              type='checkbox'
              name='changeOrder'
              onChange={this.handleCheckboxChange}
              checked={changeOrder}
            />
            <label>
              Change header order
            </label>
          </div>
        </div>
        {changeOrder && (
          <div className={sematicUI.segment}>
            {orderedHeaders.map((header, idx) => (
              <div key={header} style={{ marginBottom: '4px' }}>
                <div className={sematicUI.labeledInput} style={{ marginRight: '8px' }}>
                  <input
                    type='text'
                    name={header}
                    value={idx}
                    placeholder='Index'
                    style={{ width: '80px' }}
                    disabled
                  />
                  <div className='ui label'>
                    {header}
                  </div>
                </div>
                <button
                  type='button'
                  onClick={() => this.handleOnChangeOrder(idx, idx - 1)}
                >
                  before
                </button>
                <button
                  type='button'
                  onClick={() => this.handleOnChangeOrder(idx, idx + 1)}
                >
                  after
                </button>
              </div>
            ))}
          </div>
        )}
        <div className={sematicUI.message}>
          <p>
            {useApi
              ? 'While using async data, the state is controlled internally by the table'
              : `Total rows in the table: ${data.length}`}
          </p>
        </div>
        <SmartDataTable
          data={useApi ? apiData : data}
          dataKey=''
          headers={headers}
          orderedHeaders={orderedHeaders}
          hideUnordered={hideUnordered}
          name='test-table'
          className={sematicUI.table}
          filterValue={filterValue}
          perPage={perPage}
          sortable
          withToggles
          withLinks
          withHeader
          loader={(
            <div className={sematicUI.loader}>
              Loading...
            </div>
          )}
          onRowClick={this.onRowClick}
          parseBool={{
            yesWord: 'Indeed',
            noWord: 'Nope',
          }}
          parseImg={{
            style: {
              border: '1px solid #ddd',
              borderRadius: '2px',
              padding: '3px',
              width: '60px',
            },
            /*
            className: 'ui avatar image',
            */
          }}
          dynamic
          emptyTable={(
            <div className={sematicUI.message}>
              There is no data available to display.
            </div>
          )}
        />
      </>
    )
  }
}


ReactDOM.render(
  <AppDemo />,
  document.getElementById('app'),
)
