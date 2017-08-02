import React from 'react'
import ReactDOM from 'react-dom'
import faker from 'faker'
import SmartDataTable from './index'

var testData = []
var numResults = 100
var sematicUI = {
  segment: 'ui basic segment',
  input: 'ui icon input',
  searchIcon: 'search icon',
  table: 'ui compact selectable table',
  select: 'ui dropdown'
}
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
    },
    url: faker.internet.url()
  })
}

class AppDemo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filterValue: '',
      perPage: 0
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnPerPage = this.handleOnPerPage.bind(this)
  }

  handleOnChange({ target }) {
    this.setState({
      filterValue: target.value
    })
  }

  handleOnPerPage({ target }) {
    this.setState({
      perPage: parseInt(target.value, 10)
    })
  }

  render() {
    const { filterValue, perPage } = this.state
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
            <option value=''>Per Page</option>
            <option value='10'>10</option>
            <option value='25'>25</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
          </select>
        </div>
        <SmartDataTable
          data={testData}
          name='test-table'
          className={sematicUI.table}
          filterValue={filterValue}
          perPage={perPage}
          sortable
          withToggles
          withLinks
        />
      </div>
    );
  }
}


ReactDOM.render(
  <AppDemo />,
  document.getElementById('app')
)
