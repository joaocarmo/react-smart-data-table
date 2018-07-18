// Import modules
import React from 'react'
import ReactDOM from 'react-dom'
import faker from 'faker'
import SmartDataTable from '..'

// const apiData = 'https://jsonplaceholder.typicode.com/todos'
const numResults = 100
const sematicUI = {
  segment: 'ui basic segment',
  input: 'ui icon input',
  searchIcon: 'search icon',
  table: 'ui compact selectable table',
  select: 'ui dropdown',
}

const generateData = () => {
  const data = []
  for (let i = 0; i < numResults; i += 1) {
    data.push({
      _id: i,
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
      data: [],
      filterValue: '',
      perPage: 0,
    }

    this.setNewData = this.setNewData.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnPerPage = this.handleOnPerPage.bind(this)
  }

  componentDidMount() {
    this.setNewData()
  }

  setNewData() {
    this.setState({
      data: generateData(),
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

  render() {
    const { data, filterValue, perPage } = this.state
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
          <button type='button' className='ui icon button' onClick={this.setNewData}>
            <i className='sync alternate icon' />
          </button>
        </div>
        <SmartDataTable
          data={data}
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
            <p>
              Loading...
            </p>
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
