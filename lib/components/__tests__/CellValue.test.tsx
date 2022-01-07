import { render, screen } from '@testing-library/react'
import CellValue from '../CellValue'
import type { CellValueProps } from '../CellValue'

const setup = (props: CellValueProps = {}) => {
  const { children, content, ...otherProps } = props
  const utils = render(
    <CellValue content={content} {...otherProps}>
      {children}
    </CellValue>,
  )

  const cellValue: HTMLInputElement =
    screen.queryByText(String(children || content)) ||
    screen.queryByTestId('cell-value')

  return {
    ...utils,
    cellValue,
  }
}

describe('CellValue', () => {
  it('should render children correctly', () => {
    const { cellValue } = setup({ children: 'test children' })

    expect(cellValue).toBeInTheDocument()
  })

  it('should render content correctly', () => {
    const { cellValue } = setup({ content: 'test content' })

    expect(cellValue).toBeInTheDocument()
  })

  it('should render numbers correctly', () => {
    const { cellValue } = setup({ children: 1 })

    expect(cellValue).toBeInTheDocument()
  })

  it('should render booleans correctly', () => {
    const { cellValue } = setup({ children: true })

    expect(cellValue).toBeInTheDocument()
  })

  it('should render filterables correctly', () => {
    const { cellValue } = setup({
      children: 'alice went down the rabbit hole',
      filterable: true,
      filterValue: 'rabbit',
    })

    expect(cellValue).toBeInTheDocument()

    const highlightedValue = screen.queryByText('rabbit')

    expect(highlightedValue).toBeInTheDocument()
    expect(highlightedValue).toHaveClass('rsdt-highlight')
  })
})
