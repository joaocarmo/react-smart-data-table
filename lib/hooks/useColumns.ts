import { useMemo } from 'react'
import type { Column, Headers, UnknownObject } from '../helpers/functions'
import * as utils from '../helpers/functions'

interface UseColumnsOptions<T> {
  resolvedData: T[]
  stateColumns: Column<T>[]
  headers: Headers<T>
  orderedHeaders: string[]
  hideUnordered: boolean
  dataSampling: number
  dynamic: boolean
}

export function useColumns<T = UnknownObject>({
  resolvedData,
  stateColumns,
  headers,
  orderedHeaders,
  hideUnordered,
  dataSampling,
  dynamic,
}: UseColumnsOptions<T>): Column<T>[] {
  return useMemo(() => {
    if (!dynamic && !utils.isEmpty(stateColumns)) {
      return stateColumns
    }

    return utils.parseDataForColumns<T>(
      resolvedData,
      headers,
      orderedHeaders,
      hideUnordered,
      dataSampling,
    )
  }, [
    resolvedData,
    stateColumns,
    headers,
    orderedHeaders,
    hideUnordered,
    dataSampling,
    dynamic,
  ])
}
