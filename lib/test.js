import React from 'react'
import ReactDOM from 'react-dom'
import faker from 'faker'
import SmartDataTable from './index'

var testData = []
var numResults = 100
var sematicUI = 'ui compact selectable table'
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
    }
  })
}

class AppDemo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filterValue: ''
    }

    this.handleOnChange = this.handleOnChange.bind(this)
  }

  handleOnChange({ target }) {
    this.setState({
      filterValue: target.value
    })
  }

  render() {
    const { filterValue } = this.state
    return (
      <div>
        <div>
          <input
            type='text'
            name='filter'
            placeholder='Filter results...'
            onChange={this.handleOnChange}
          />
        </div>
        <SmartDataTable
          data={testData}
          name='test-table'
          className={sematicUI}
          filterValue={filterValue}
          sortable
        />
      </div>
    );
  }
}


ReactDOM.render(
  <AppDemo />,
  document.getElementById('app')
)
