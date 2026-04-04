import { render, screen } from '@testing-library/react'
import SmartDataTable from '../SmartDataTable'

const testData = [
  { _id: 1, name: 'Alice', role: 'admin' },
  { _id: 2, name: 'Bob', role: 'user' },
  { _id: 3, name: 'Carol', role: 'admin' },
]

describe('rowClassName prop', () => {
  it('applies the class returned by rowClassName to each row', () => {
    render(
      <SmartDataTable
        data={testData}
        name="test-table"
        rowClassName={(row) => (row.role === 'admin' ? 'highlight' : '')}
      />,
    )

    const rows = screen.getAllByRole('row')
    // First row is the header
    const bodyRows = rows.slice(1)

    expect(bodyRows).toHaveLength(3)
    expect(bodyRows[0]).toHaveClass('highlight')
    expect(bodyRows[1]).not.toHaveClass('highlight')
    expect(bodyRows[2]).toHaveClass('highlight')
  })

  it('passes rowData, rowIndex, and tableData to the callback', () => {
    const rowClassNameSpy = vi.fn(() => '')

    render(
      <SmartDataTable
        data={testData}
        name="test-table"
        rowClassName={rowClassNameSpy}
      />,
    )

    expect(rowClassNameSpy).toHaveBeenCalledTimes(3)
    expect(rowClassNameSpy).toHaveBeenNthCalledWith(1, testData[0], 0, testData)
    expect(rowClassNameSpy).toHaveBeenNthCalledWith(2, testData[1], 1, testData)
  })

  it('renders rows without className when rowClassName is omitted', () => {
    render(<SmartDataTable data={testData} name="test-table" />)

    const rows = screen.getAllByRole('row')
    const bodyRows = rows.slice(1)

    bodyRows.forEach((row) => {
      expect(row.className).toBe('')
    })
  })
})
