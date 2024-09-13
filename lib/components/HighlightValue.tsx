import { useMemo } from 'react'
import type { FC, PropsWithChildren } from 'react'
import * as utils from '../helpers/functions'

interface HighlightValueProps {
  filterValue: string
  'data-testid'?: string
}

const HighlightValue: FC<PropsWithChildren<HighlightValueProps>> = ({
  children,
  filterValue = '',
  'data-testid': testId = 'highlight-value',
}) => {
  const { first, highlight, last } = useMemo(
    () => utils.highlightValueParts(String(children), filterValue),
    [children, filterValue],
  )

  if (!first && !highlight && !last) {
    return children as JSX.Element
  }

  return (
    <span data-testid={testId}>
      {first}
      <span className="rsdt rsdt-highlight">{highlight}</span>
      {last}
    </span>
  )
}

export default HighlightValue
