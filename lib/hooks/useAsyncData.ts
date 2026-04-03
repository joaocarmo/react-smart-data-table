import { useEffect, useRef } from 'react'
import type { Dispatch } from 'react'
import type { TableReducerAction } from './useTableReducer'
import type {
  Column,
  FetchDataOptions,
  UnknownObject,
} from '../helpers/functions'
import TableAction from '../helpers/table-action.enum'
import * as utils from '../helpers/functions'

interface UseAsyncDataOptions<T> {
  data: string | T[]
  dataKey: string
  dataKeyResolver: utils.KeyResolverFN<T>
  dataRequestOptions: RequestInit
  headers: utils.Headers<T>
  orderedHeaders: string[]
  hideUnordered: boolean
  dataSampling: number
  dispatch: Dispatch<TableReducerAction<T>>
}

export function useAsyncData<T = UnknownObject>({
  data,
  dataKey,
  dataKeyResolver,
  dataRequestOptions,
  headers,
  orderedHeaders,
  hideUnordered,
  dataSampling,
  dispatch,
}: UseAsyncDataOptions<T>): void {
  // Capture column-parsing deps in a ref so they don't trigger re-fetches.
  // Only `data` changes should trigger a new fetch (matching original behavior).
  const columnDepsRef = useRef({
    headers,
    orderedHeaders,
    hideUnordered,
    dataSampling,
  })
  columnDepsRef.current = {
    headers,
    orderedHeaders,
    hideUnordered,
    dataSampling,
  }

  useEffect(() => {
    if (!utils.isString(data)) {
      return
    }

    const fetchOptions: FetchDataOptions<T> = {
      dataKey,
      dataKeyResolver,
      options: dataRequestOptions,
    }

    dispatch({ type: TableAction.FetchStart })

    void utils
      .fetchData(data as string, fetchOptions)
      .then((asyncData) => {
        const currentDeps = columnDepsRef.current

        const columns = utils.parseDataForColumns<T>(
          asyncData as T[],
          currentDeps.headers,
          currentDeps.orderedHeaders,
          currentDeps.hideUnordered,
          currentDeps.dataSampling,
        )

        dispatch({
          type: TableAction.FetchSuccess,
          asyncData: asyncData as T[],
          columns: columns as Column<T>[],
        })
      })
      .catch((err: unknown) => {
        dispatch({ type: TableAction.FetchError })
        utils.errorPrint(err)
      })
  }, [data, dataKey, dataKeyResolver, dataRequestOptions, dispatch])
}
