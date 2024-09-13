import { memo, MouseEvent, useCallback } from 'react'
import type { FC } from 'react'
import cx from 'clsx'
import * as utils from '../helpers/functions'
import '../css/paginator.css'

export type PageChangeFnOpts = {
  activePage: number
}

export type PageChangeFn = (
  event: MouseEvent<HTMLElement>,
  options: PageChangeFnOpts,
) => void

interface PaginatorItemProps {
  active: boolean
  value?: number
  text: string
  onPageChange: PageChangeFn
}

const areEqual = (
  { active: prevActive, value: prevValue, text: prevText }: PaginatorItemProps,
  { active: nextActive, value: nextValue, text: nextText }: PaginatorItemProps,
) =>
  prevActive === nextActive && prevValue === nextValue && prevText === nextText

const PaginatorItem: FC<PaginatorItemProps> = ({
  active,
  value,
  text,
  onPageChange,
}) => {
  const handleOnPageChange = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      onPageChange(event, { activePage: value })
    },
    [onPageChange, value],
  )

  return (
    <button
      className={cx('rsdt', 'rsdt-paginate', { active }, 'button')}
      type="button"
      onClick={handleOnPageChange}
      disabled={utils.isUndefined(value)}
      data-testid="paginator-item"
    >
      {text}
    </button>
  )
}

export default memo(PaginatorItem, areEqual)
