import { render, screen, fireEvent, act } from '@testing-library/react'
import SmartDataTable from './SmartDataTable'
import * as utils from './helpers/functions'

// Generate 10k rows with 10 columns each
function generateRows(count: number) {
  const rows = []

  for (let i = 0; i < count; i++) {
    rows.push({
      id: i,
      first_name: `First${i}`,
      last_name: `Last${i}`,
      email: `user${i}@example.com`,
      phone: `555-${String(i).padStart(4, '0')}`,
      city: `City${i % 100}`,
      country: `Country${i % 50}`,
      company: `Company${i % 200}`,
      department: `Dept${i % 20}`,
      salary: 30000 + (i % 70000),
    })
  }

  return rows
}

const ROW_COUNT = 10_000
const PER_PAGE = 50
const testData = generateRows(ROW_COUNT)

describe('SmartDataTable Performance', () => {
  let parseDataForRowsSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    parseDataForRowsSpy = vi.spyOn(utils, 'parseDataForRows')
  })

  afterEach(() => {
    parseDataForRowsSpy.mockRestore()
  })

  it('renders 10k rows without crashing', () => {
    const { container } = render(
      <SmartDataTable data={testData} name="perf-test" perPage={PER_PAGE} />,
    )

    expect(container.querySelector('table')).toBeTruthy()
    expect(parseDataForRowsSpy).toHaveBeenCalled()
  })

  it('measures initial render time', () => {
    const start = performance.now()

    render(
      <SmartDataTable data={testData} name="perf-test" perPage={PER_PAGE} />,
    )

    const elapsed = performance.now() - start

    // Log for baseline comparison — this is not a pass/fail assertion
    console.log(
      `[PERF] Initial render (${ROW_COUNT} rows): ${elapsed.toFixed(1)}ms`,
    )

    // Sanity check: should complete within 10 seconds even on slow CI
    expect(elapsed).toBeLessThan(10_000)
  })

  it('tracks parseDataForRows calls on page change', () => {
    render(
      <SmartDataTable
        data={testData}
        name="perf-test"
        perPage={PER_PAGE}
        sortable
      />,
    )

    const initialCallCount = parseDataForRowsSpy.mock.calls.length

    // Click "next page" button
    const nextButton = screen
      .getAllByTestId('paginator-item')
      .find((el) => el.textContent === '>')

    expect(nextButton).toBeTruthy()

    act(() => {
      fireEvent.click(nextButton!)
    })

    const callsAfterPageChange = parseDataForRowsSpy.mock.calls.length

    // BEFORE optimization: parseDataForRows IS called again on page change
    // AFTER optimization: parseDataForRows should NOT be called again
    // We record both values so we can compare before/after the refactor
    const extraCalls = callsAfterPageChange - initialCallCount

    console.log(
      `[PERF] parseDataForRows calls on page change: ${extraCalls} ` +
        `(initial: ${initialCallCount}, after: ${callsAfterPageChange})`,
    )

    // Memoization: page change must NOT trigger re-flatten
    expect(extraCalls).toBe(0)
  })

  it('tracks parseDataForRows calls on sort change', () => {
    render(
      <SmartDataTable
        data={testData}
        name="perf-test"
        perPage={PER_PAGE}
        sortable
      />,
    )

    const initialCallCount = parseDataForRowsSpy.mock.calls.length

    // Click a column header sorting icon
    const sortIcon = document.querySelector('.rsdt-sortable-icon')

    expect(sortIcon).toBeTruthy()

    act(() => {
      fireEvent.click(sortIcon!)
    })

    const callsAfterSort = parseDataForRowsSpy.mock.calls.length
    const extraCalls = callsAfterSort - initialCallCount

    console.log(
      `[PERF] parseDataForRows calls on sort: ${extraCalls} ` +
        `(initial: ${initialCallCount}, after: ${callsAfterSort})`,
    )

    // Memoization: sort change must NOT trigger re-flatten
    expect(extraCalls).toBe(0)
  })

  it('tracks parseDataForRows calls on filter change', () => {
    const { rerender } = render(
      <SmartDataTable
        data={testData}
        name="perf-test"
        perPage={PER_PAGE}
        sortable
        filterValue=""
      />,
    )

    const initialCallCount = parseDataForRowsSpy.mock.calls.length

    rerender(
      <SmartDataTable
        data={testData}
        name="perf-test"
        perPage={PER_PAGE}
        sortable
        filterValue="First42"
      />,
    )

    const callsAfterFilter = parseDataForRowsSpy.mock.calls.length
    const extraCalls = callsAfterFilter - initialCallCount

    console.log(
      `[PERF] parseDataForRows calls on filter: ${extraCalls} ` +
        `(initial: ${initialCallCount}, after: ${callsAfterFilter})`,
    )

    // Memoization: filter change must NOT trigger re-flatten
    expect(extraCalls).toBe(0)
  })
})
