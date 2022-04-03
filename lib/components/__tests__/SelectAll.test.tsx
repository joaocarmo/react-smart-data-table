import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SelectAll from '../SelectAll'
import type { SelectAllProps } from '../SelectAll'

const selectAllWord = 'selectAllWord'
const unSelectAllWord = 'unSelectAllWord'

const setup = (
  { locale, handleToggleAll }: SelectAllProps = { handleToggleAll: jest.fn() },
) => {
  const utils = render(
    <SelectAll locale={locale} handleToggleAll={handleToggleAll} />,
  )

  const selectAll: HTMLInputElement = screen.getByTestId('select-all')

  return {
    ...utils,
    selectAll,
  }
}

describe('SelectAll', () => {
  it('should render correctly', () => {
    const { selectAll } = setup()

    expect(selectAll).toBeInTheDocument()
  })

  it('should function correctly', () => {
    const { selectAll } = setup({
      locale: {
        selectAllWord,
        unSelectAllWord,
      },
      handleToggleAll: jest.fn(),
    })

    expect(selectAll).toBeInTheDocument()

    expect(selectAll.checked).toBe(false)

    expect(screen.getByText(selectAllWord)).toBeInTheDocument()

    userEvent.click(selectAll)

    expect(selectAll.checked).toBe(true)

    expect(screen.getByText(unSelectAllWord)).toBeInTheDocument()

    userEvent.click(selectAll)

    expect(selectAll.checked).toBe(false)

    expect(screen.getByText(selectAllWord)).toBeInTheDocument()
  })
})
