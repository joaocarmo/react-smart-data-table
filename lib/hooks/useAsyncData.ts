import { useEffect, useRef } from 'react'
import type { Dispatch } from 'react'
import type { TableReducerAction } from './useTableReducer'
import type {
  Column,
  FetchDataOptions,
  Headers,
  UnknownObject,
} from '../helpers/functions'
import TableAction from '../helpers/table-action.enum'
import * as utils from '../helpers/functions'

interface UseAsyncDataOptions<T> {
  data: string | T[]
  dataKey: string
  dataKeyResolver: utils.KeyResolverFN<T>
  dataRequestOptions: RequestInit
  headers: Headers<T>
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
  const prevDataRef = useRef<string | T[]>(data)

  useEffect(() => {
    const prevData = prevDataRef.current
    prevDataRef.current = data

    if (!utils.isString(data)) {
      return
    }

    // Only fetch if data is a string (URL) and has changed or is first mount
    if (
      typeof data !== typeof prevData ||
      data !== prevData ||
      prevData === data
    ) {
      const fetchOptions: FetchDataOptions<T> = {
        dataKey,
        dataKeyResolver,
        options: dataRequestOptions,
      }

      dispatch({ type: TableAction.FetchStart })

      void utils
        .fetchData(data as string, fetchOptions)
        .then((asyncData) => {
          const columns = utils.parseDataForColumns<T>(
            asyncData as T[],
            headers,
            orderedHeaders,
            hideUnordered,
            dataSampling,
          )

          dispatch({
            type: TableAction.FetchSuccess,
            asyncData: asyncData as T[],
            columns: columns as Column<T>[],
          })
        })
        .catch((err) => {
          dispatch({ type: TableAction.FetchError })
          throw new Error(String(err), { cause: err })
        })
    }
  }, [
    data,
    dataKey,
    dataKeyResolver,
    dataRequestOptions,
    headers,
    orderedHeaders,
    hideUnordered,
    dataSampling,
    dispatch,
  ])
}
