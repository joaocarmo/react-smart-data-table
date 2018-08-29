// Import modules
import React from 'react'
import ReactDOM from 'react-dom'
import faker from 'faker'
import SmartDataTable from '..'

const sematicUI = {
  segment: 'ui basic segment',
  input: 'ui icon input',
  searchIcon: 'search icon',
  table: 'ui compact selectable table',
  select: 'ui dropdown',
  refresh: 'ui labeled primary icon button',
  refreshIcon: 'sync alternate icon',
  change: 'ui labeled secondary icon button',
  changeIcon: 'exchange icon',
  loader: 'ui active text loader',
}

const apiDataUrls = [
  'https://jsonplaceholder.typicode.com/users',
  'https://jsonplaceholder.typicode.com/todos',
  'https://jsonplaceholder.typicode.com/albums',
  'https://jsonplaceholder.typicode.com/photos',
]

const generateData = (numResults) => {
  const data = []
  for (let i = 0; i < numResults; i += 1) {
    data.push({
      _id: i,
      avatar: faker.image.avatar(),
      fullName: faker.name.findName(),
      'email.address': faker.internet.email(),
      phone_number: faker.phone.phoneNumber(),
      address: {
        city: faker.address.city(),
        state: faker.address.state(),
        country: faker.address.country(),
      },
      url: faker.internet.url(),
      isMarried: faker.random.boolean(),
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
      numResults: 100,
      data: [],
      filterValue: '',
      perPage: 0,
      showOnRowClick: true,
    }

    this.setNewData = this.setNewData.bind(this)
    this.setApiData = this.setApiData.bind(this)
    this.changeData = this.changeData.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnPerPage = this.handleOnPerPage.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.onRowClick = this.onRowClick.bind(this)
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

  handleOnChange({ target: { name, value } }) {
    this.setState({ [name]: value })
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

  handleCheckboxChange() {
    const { showOnRowClick } = this.state
    this.setState({ showOnRowClick: !showOnRowClick })
  }

  onRowClick(event, { rowData, rowIndex, tableData }) {
    const { showOnRowClick } = this.state
    if (showOnRowClick) {
      const { fullName } = rowData
      window.alert(`You clicked ${fullName}'s row !`)
    } else {
      // The following results should be identical
      console.log(rowData, tableData[rowIndex])
    }
  }

  render() {
    const {
      useApi, apiData, data, filterValue, perPage, showOnRowClick,
    } = this.state
    const divider = <span style={{ display: 'inline-block', margin: '10px' }} />
    return (
      <div>
        <div className={sematicUI.segment}>
          <div className={sematicUI.input}>
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
          {divider}
          <div className='ui toggle checkbox'>
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
        </div>
        <SmartDataTable
          data={useApi ? apiData : data}
          dataKey=''
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
        />
      </div>
    )
  }
}


ReactDOM.render(
  <AppDemo />,
  document.getElementById('app'),
)
