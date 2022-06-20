import { PureComponent } from 'react'
import { createRoot } from 'react-dom/client'
import { imgb64 } from '../lib/helpers/tests'
import SmartDataTable from 'react-smart-data-table-dev'
import 'react-smart-data-table-dev.css'

const sematicUI = {
  change: 'ui labeled secondary icon button',
  changeIcon: 'exchange icon',
  checkbox: 'ui toggle checkbox',
  deleteIcon: 'trash red icon',
  input: 'ui input',
  iconInput: 'ui icon input',
  labeledInput: 'ui right labeled input',
  loader: 'ui active text loader',
  message: 'ui message',
  refresh: 'ui labeled primary icon button',
  refreshIcon: 'sync alternate icon',
  rowsIcon: 'numbered list icon',
  searchIcon: 'search icon',
  segment: 'ui segment',
  select: 'ui dropdown',
  table: 'ui compact selectable table',
}

const generateData = async (numResults = 0) => {
  const faker = await import('@withshepherd/faker')

  let total = numResults || 0

  if (typeof numResults === 'string') {
    total = parseInt(numResults, 10)
  }

  const data = []

  for (let i = 0; i < total; i += 1) {
    const row = {
      _id: i,
      address: {
        city: faker.address.city(),
        state: faker.address.state(),
        country: faker.address.country(),
      },
      url: faker.internet.url(),
      isMarried: faker.datatype.boolean(),
      actions: null,
      avatar: imgb64,
      fullName: faker.name.findName(),
      _username: faker.internet.userName(),
      password_: faker.internet.password(),
      'email.address': faker.internet.email(),
      phone_number: faker.phone.phoneNumber(),
    }

    // Add random attributes to random rows (after the first)
    if (i > 0 && faker.datatype.boolean()) {
      const column = faker.database.column()

      if (!row[column]) {
        row[column] = faker.datatype.number()
      }
    }

    data.push(row)
  }

  return data
}

const emptyTable = (
  <div className={sematicUI.message}>
    There is no data available to display.
  </div>
)

const loader = <div className={sematicUI.loader}>Loading...</div>

const DeleteButton = ({ handleDelete }) => (
  <i
    className={sematicUI.deleteIcon}
    style={{ cursor: 'pointer' }}
    onClick={handleDelete}
    onKeyDown={handleDelete}
    role="button"
    tabIndex="0"
    aria-label="delete row"
  />
)

class AppDemo extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      useApi: false,
      apiUrl: 'https://randomuser.me/api/?results=100',
      apiUrlNew: 'https://randomuser.me/api/?results=100',
      dataKey: 'results',
      numResults: 10,
      data: [],
      dataSampling: 0,
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

    this.changeData = this.changeData.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.handleNewApiUrl = this.handleNewApiUrl.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnChangeOrder = this.handleOnChangeOrder.bind(this)
    this.handleOnPerPage = this.handleOnPerPage.bind(this)
    this.onRowClick = this.onRowClick.bind(this)
    this.setNewData = this.setNewData.bind(this)
  }

  componentDidMount() {
    this.setNewData()
  }

  async setNewData() {
    const { numResults } = this.state

    const data = await generateData(numResults)

    this.setState({ data })
  }

  handleNewApiUrl() {
    const { apiUrlNew } = this.state
    this.setState({ apiUrl: apiUrlNew })
  }

  handleDelete(event, idx, row) {
    event.preventDefault()
    event.stopPropagation()

    const { data } = this.state
    const newData = JSON.parse(JSON.stringify(data))

    newData.splice(idx, 1)

    this.setState({ data: newData })
  }

  getHeaders() {
    return {
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
      fullName: {
        sortable: (a, b) => a.fullName.localeCompare(b.fullName),
      },
      phone_number: {
        sortable: false,
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
        sortable: (a, b) =>
          a.url
            .replace(/^https?:\/\//, '')
            .localeCompare(b.url.replace(/^https?:\/\//, '')),
      },
      actions: {
        text: 'Actions',
        sortable: false,
        filterable: false,
        transform: (value, idx, row) => (
          <DeleteButton handleDelete={(e) => this.handleDelete(e, idx, row)} />
        ),
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
      apiUrl,
      apiUrlNew,
      changeOrder,
      data,
      dataKey,
      dataSampling,
      filterValue,
      hideUnordered,
      numResults,
      orderedHeaders,
      perPage,
      showOnRowClick,
      useApi,
    } = this.state
    const divider = <span style={{ display: 'inline-block', margin: '10px' }} />
    const headers = this.getHeaders()

    return (
      <>
        <div className={sematicUI.segment}>
          <div className={sematicUI.iconInput}>
            <input
              type="text"
              name="filterValue"
              value={filterValue}
              placeholder="Filter results..."
              onChange={this.handleOnChange}
            />
            <i className={sematicUI.searchIcon} />
          </div>
          {divider}
          <select
            name="perPage"
            value={perPage}
            className={sematicUI.select}
            onChange={this.handleOnPerPage}
          >
            <option value="0">Per Page</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          {divider}
          {!useApi && (
            <>
              <button
                type="button"
                className={sematicUI.refresh}
                onClick={this.setNewData}
              >
                <i className={sematicUI.refreshIcon} />
                Refresh Faker
              </button>
              {divider}
            </>
          )}
          <button
            type="button"
            className={sematicUI.change}
            onClick={this.changeData}
          >
            <i className={sematicUI.changeIcon} />
            {useApi ? 'Use Faker' : 'Use Async API'}
          </button>
          {!useApi && (
            <span>
              {divider}
              <div className={sematicUI.iconInput}>
                <input
                  type="text"
                  name="numResults"
                  value={numResults}
                  placeholder="# Rows"
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
              type="checkbox"
              name="showOnRowClick"
              onChange={this.handleCheckboxChange}
              checked={showOnRowClick}
            />
            <label>Show alert on row click</label>
          </div>
          {divider}
          {!useApi && (
            <div className={sematicUI.checkbox}>
              <input
                type="checkbox"
                name="changeOrder"
                onChange={this.handleCheckboxChange}
                checked={changeOrder}
              />
              <label>Change header order</label>
            </div>
          )}
          {divider}
          {!useApi && (
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <input
                type="range"
                id="dataSampling"
                name="dataSampling"
                min={0}
                max={100}
                onChange={this.handleOnChange}
                value={dataSampling}
              />
              <label htmlFor="dataSampling">
                Data sampling ({dataSampling}%)
              </label>
            </span>
          )}
        </div>
        {useApi && (
          <div className={sematicUI.segment}>
            <div className={sematicUI.input} style={{ width: '50%' }}>
              <input
                type="text"
                name="apiUrlNew"
                value={apiUrlNew}
                placeholder="https://my-api-location/users"
                onChange={this.handleOnChange}
              />
            </div>
            {divider}
            <div className={sematicUI.input} style={{ width: '10%' }}>
              <input
                type="text"
                name="dataKey"
                value={dataKey}
                placeholder="data key"
                onChange={this.handleOnChange}
              />
            </div>
            {divider}
            <button
              type="button"
              className={sematicUI.refresh}
              onClick={this.handleNewApiUrl}
            >
              <i className={sematicUI.refreshIcon} />
              Load
            </button>
          </div>
        )}
        {changeOrder && (
          <div className={sematicUI.segment}>
            {orderedHeaders.map((header, idx) => (
              <div key={header} style={{ marginBottom: '4px' }}>
                <div
                  className={sematicUI.labeledInput}
                  style={{ marginRight: '8px' }}
                >
                  <input
                    type="text"
                    name={header}
                    value={idx}
                    placeholder="Index"
                    style={{ width: '80px' }}
                    disabled
                  />
                  <div className="ui label">{header}</div>
                </div>
                <button
                  type="button"
                  onClick={() => this.handleOnChangeOrder(idx, idx - 1)}
                >
                  before
                </button>
                <button
                  type="button"
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
        {useApi && (
          <SmartDataTable
            name="test-async-table"
            data={apiUrl}
            dataKey={dataKey}
            onRowClick={this.onRowClick}
            emptyTable={emptyTable}
            loader={loader}
            filterValue={filterValue}
            perPage={perPage}
            parseImg={{ className: 'ui avatar image' }}
            className={sematicUI.table}
            parseBool
            dynamic
            sortable
            withToggles
            withLinks
            withHeader
          />
        )}
        {!useApi && (
          <SmartDataTable
            name="test-fake-table"
            data={data}
            dataSampling={parseInt(String(dataSampling), 10)}
            headers={headers}
            orderedHeaders={orderedHeaders}
            hideUnordered={hideUnordered}
            className={sematicUI.table}
            filterValue={filterValue}
            perPage={perPage}
            sortable
            withToggles={{
              selectAll: true,
            }}
            withLinks
            withHeader
            loader={loader}
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
            }}
            emptyTable={emptyTable}
          />
        )}
        <footer className="ui center aligned basic segment container">
          <p>
            <strong>React Smart Data Table</strong>
            {' by '}
            <a href="//joaocarmo.com" target="_blank">
              João Carmo
            </a>
          </p>
        </footer>
      </>
    )
  }
}

const container = document.getElementById('app')
const root = createRoot(container)
root.render(<AppDemo />)
