import type { PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import CellValue from './CellValue'
import type { CellValueProps } from './CellValue'

const setup = (props: PropsWithChildren<CellValueProps>) => {
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

  it('should render URLs correctly', () => {
    const url = 'https://example.com'
    const { cellValue } = setup({
      children: url,
      withLinks: true,
    })

    expect(cellValue).toBeInTheDocument()
    expect(cellValue).toHaveAttribute('href', url)
  })

  it('should render images correctly', () => {
    const birdImg = 'https://example.com/img/bird.jpg'
    const { cellValue } = setup({
      children: birdImg,
      parseImg: true,
    })

    expect(cellValue).toBeInTheDocument()
    expect(cellValue).toHaveAttribute('src', birdImg)
  })

  it('should render images with links correctly', () => {
    const planeImg = 'https://example.com/img/plane.jpg'
    const { cellValue } = setup({
      children: planeImg,
      parseImg: true,
      withLinks: true,
    })

    expect(cellValue).toBeInTheDocument()
    expect(cellValue).toHaveAttribute('src', planeImg)
    expect(cellValue.parentElement).toHaveAttribute('href', planeImg)
  })

  it('should render data URLs correctly', () => {
    const dataURL = `\
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI1\
2P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==\
`
    const { cellValue } = setup({
      children: dataURL,
      parseImg: true,
    })

    expect(cellValue).toBeInTheDocument()
    expect(cellValue).toHaveAttribute('src', dataURL)
  })
})
