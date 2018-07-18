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

const generateData = (numResults) => {
  const data = []
  for (let i = 0; i < numResults; i += 1) {
    data.push({
      _id: i,
      // avatar: faker.image.avatar(),
      fullName: faker.name.findName(),
      'email.address': faker.internet.email(),
      phone_number: faker.phone.phoneNumber(),
      address: {
        city: faker.address.city(),
        state: faker.address.state(),
        country: faker.address.country(),
      },
      url: faker.internet.url(),
    })
  }
  return data
}

class AppDemo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      useApi: false,
      apiData: 'https://jsonplaceholder.typicode.com/users',
      numResults: 100,
      data: [],
      filterValue: '',
      perPage: 0,
    }

    this.setNewData = this.setNewData.bind(this)
    this.changeData = this.changeData.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnPerPage = this.handleOnPerPage.bind(this)
  }

  componentDidMount() {
    const { numResults } = this.state
    this.setNewData(numResults)
  }

  setNewData() {
    const { numResults } = this.state
    this.setState({
      data: generateData(numResults),
    })
  }

  handleOnChange({ target }) {
    this.setState({
      filterValue: target.value,
    })
  }

  handleOnPerPage({ target }) {
    this.setState({
      perPage: parseInt(target.value, 10),
    })
  }

  changeData() {
    const { useApi } = this.state
    this.setState({ useApi: !useApi })
  }

  render() {
    const {
      useApi, apiData, data, filterValue, perPage,
    } = this.state
    return (
      <div>
        <div className={sematicUI.segment}>
          <div className={sematicUI.input}>
            <input
              type='text'
              name='filter'
              placeholder='Filter results...'
              onChange={this.handleOnChange}
            />
            <i className={sematicUI.searchIcon} />
          </div>
          {' '}
          <select className={sematicUI.select} onChange={this.handleOnPerPage}>
            <option value=''>
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
          {' '}
          <button type='button' className={sematicUI.refresh} onClick={this.setNewData}>
            <i className={sematicUI.refreshIcon} />
            Refresh Faker
          </button>
          {' '}
          <button type='button' className={sematicUI.change} onClick={this.changeData}>
            <i className={sematicUI.changeIcon} />
            {useApi ? 'Use Faker' : 'Use Async API'}
          </button>
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
          withHeaders
          loader={(
            <div className={sematicUI.loader}>
              Loading...
            </div>
          )}
        />
      </div>
    )
  }
}


ReactDOM.render(
  <AppDemo />,
  document.getElementById('app'),
)
