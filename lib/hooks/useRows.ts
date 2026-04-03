import { useMemo } from 'react'
import type { Headers, Sorting, UnknownObject } from '../helpers/functions'
import * as utils from '../helpers/functions'
import { ORDER_ASC } from '../helpers/constants'

interface UseRowsOptions<T> {
  resolvedData: T[]
  sorting: Sorting
  colProperties: Headers<T>
  filterValue: string
  activePage: number
  perPage: number
}

interface UseRowsResult<T> {
  flattenedRows: T[]
  filteredRows: T[]
  visibleRows: T[]
}

export function useRows<T = UnknownObject>({
  resolvedData,
  sorting,
  colProperties,
  filterValue,
  activePage,
  perPage,
}: UseRowsOptions<T>): UseRowsResult<T> {
  // Layer 2: Flatten once
  const flattenedRows = useMemo(
    () => utils.parseDataForRows(resolvedData),
    [resolvedData],
  )

  // Layer 3: Sort only when sorting changes
  const sortedRows = useMemo(() => {
    const { dir, key } = sorting

    if (!dir) {
      return flattenedRows
    }

    const compareFn =
      typeof colProperties[key]?.sortable === 'function' &&
      colProperties[key].sortable

    const sorted = utils.sortBy(flattenedRows, key, compareFn)

    return dir === ORDER_ASC ? sorted : sorted.reverse()
  }, [flattenedRows, sorting, colProperties])

  // Layer 4: Filter only when filter changes
  const filteredRows = useMemo(
    () => utils.filterRows(filterValue, sortedRows, colProperties),
    [filterValue, sortedRows, colProperties],
  )

  // Layer 5: Slice for pagination
  const visibleRows = useMemo(
    () => utils.sliceRowsPerPage(filteredRows, activePage, perPage),
    [filteredRows, activePage, perPage],
  )

  return { flattenedRows, filteredRows, visibleRows }
}
