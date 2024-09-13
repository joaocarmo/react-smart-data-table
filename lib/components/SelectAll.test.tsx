import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SelectAll from './SelectAll'

const selectAllWord = 'selectAllWord'
const unSelectAllWord = 'unSelectAllWord'

describe('SelectAll', () => {
  it('should function correctly', async () => {
    render(
      <SelectAll
        locale={{
          selectAllWord,
          unSelectAllWord,
        }}
        handleToggleAll={jest.fn()}
      />,
    )

    const selectAll: HTMLInputElement = screen.getByTestId('select-all')

    expect(selectAll).toBeInTheDocument()

    expect(selectAll.checked).toBe(false)

    expect(screen.getByText(selectAllWord)).toBeInTheDocument()

    await userEvent.click(selectAll)

    expect(selectAll.checked).toBe(true)

    expect(screen.getByText(unSelectAllWord)).toBeInTheDocument()

    await userEvent.click(selectAll)

    expect(selectAll.checked).toBe(false)

    expect(screen.getByText(selectAllWord)).toBeInTheDocument()
  })
})
