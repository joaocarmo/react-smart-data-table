import { useReducer } from 'react'
import type { SmartDataTableState } from '../types'
import type { Column, Headers, UnknownObject } from '../helpers/functions'
import TableAction from '../helpers/table-action.enum'
import * as constants from '../helpers/constants'
import defaultState from '../helpers/default-state'

export type TableReducerAction<T = UnknownObject> =
  | { type: TableAction.FetchStart }
  | { type: TableAction.FetchSuccess; asyncData: T[]; columns: Column<T>[] }
  | { type: TableAction.FetchError }
  | { type: TableAction.SetSorting; column: Column<T> }
  | { type: TableAction.SetActivePage; activePage: number }
  | { type: TableAction.SetColProperties; colProperties: Headers<T> }
  | { type: TableAction.ToggleColumn; key: string }
  | {
      type: TableAction.ToggleAllColumns
      columns: Column<T>[]
      isChecked: boolean
    }
  | { type: TableAction.ResetPageForFilter; filterValue: string }

function tableReducer<T = UnknownObject>(
  state: SmartDataTableState<T>,
  action: TableReducerAction<T>,
): SmartDataTableState<T> {
  switch (action.type) {
    case TableAction.FetchStart:
      return { ...state, isLoading: true }

    case TableAction.FetchSuccess:
      return {
        ...state,
        asyncData: action.asyncData,
        columns: action.columns,
        isLoading: false,
      }

    case TableAction.FetchError:
      return { ...state, isLoading: false }

    case TableAction.SetSorting: {
      const { key } = action.column
      const prevDir = state.sorting.key === key ? state.sorting.dir : ''
      let dir: string

      if (prevDir) {
        dir = prevDir === constants.ORDER_ASC ? constants.ORDER_DESC : ''
      } else {
        dir = constants.ORDER_ASC
      }

      return { ...state, sorting: { key, dir } }
    }

    case TableAction.SetActivePage:
      return { ...state, activePage: action.activePage }

    case TableAction.SetColProperties:
      return { ...state, colProperties: action.colProperties }

    case TableAction.ToggleColumn: {
      const { key } = action
      const prev = state.colProperties[key] ?? {
        ...constants.defaultHeader,
        key,
      }

      return {
        ...state,
        colProperties: {
          ...state.colProperties,
          [key]: { ...prev, invisible: !prev.invisible },
        },
      }
    }

    case TableAction.ToggleAllColumns: {
      const newColProperties = { ...state.colProperties }

      for (const { key } of action.columns) {
        const prev = newColProperties[key] ?? {
          ...constants.defaultHeader,
          key,
        }
        newColProperties[key] = { ...prev, invisible: action.isChecked }
      }

      return { ...state, colProperties: newColProperties }
    }

    case TableAction.ResetPageForFilter:
      return {
        ...state,
        activePage: 1,
        prevFilterValue: action.filterValue,
      }

    default:
      return state
  }
}

export function useTableReducer<T = UnknownObject>(
  initialColProperties: Headers<T> = {} as Headers<T>,
) {
  return useReducer(tableReducer<T>, {
    ...(defaultState as SmartDataTableState<T>),
    colProperties: initialColProperties,
  })
}
