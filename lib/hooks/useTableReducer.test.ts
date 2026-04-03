import { renderHook, act } from '@testing-library/react'
import { useTableReducer } from './useTableReducer'
import type { TableReducerAction } from './useTableReducer'
import TableAction from '../helpers/table-action.enum'
import { ORDER_ASC, ORDER_DESC } from '../helpers/constants'
import type { Column, Headers, UnknownObject } from '../helpers/functions'

function setup(initialColProperties?: Headers<UnknownObject>) {
  return renderHook(() => useTableReducer(initialColProperties))
}

function dispatch(
  hook: ReturnType<typeof setup>,
  action: TableReducerAction<UnknownObject>,
) {
  act(() => {
    hook.result.current[1](action)
  })
}

const mockColumn: Column<UnknownObject> = {
  key: 'name',
  text: 'Name',
  invisible: false,
  sortable: true,
  filterable: true,
  isImg: false,
}

describe('useTableReducer', () => {
  it('initializes with default state', () => {
    const { result } = setup()
    const [state] = result.current

    expect(state.activePage).toBe(1)
    expect(state.asyncData).toEqual([])
    expect(state.colProperties).toEqual({})
    expect(state.columns).toEqual([])
    expect(state.isLoading).toBe(false)
    expect(state.sorting).toEqual({ key: '', dir: '' })
  })

  it('initializes with provided colProperties', () => {
    const headers = { name: mockColumn } as Headers<UnknownObject>
    const { result } = setup(headers)

    expect(result.current[0].colProperties).toBe(headers)
  })

  describe('FetchStart / FetchSuccess / FetchError', () => {
    it('sets isLoading on FetchStart', () => {
      const hook = setup()

      dispatch(hook, { type: TableAction.FetchStart })

      expect(hook.result.current[0].isLoading).toBe(true)
    })

    it('sets asyncData, columns, and clears isLoading on FetchSuccess', () => {
      const hook = setup()
      const asyncData = [{ name: 'Alice' }]
      const columns = [mockColumn]

      dispatch(hook, { type: TableAction.FetchStart })
      dispatch(hook, {
        type: TableAction.FetchSuccess,
        asyncData,
        columns,
      })

      const state = hook.result.current[0]

      expect(state.isLoading).toBe(false)
      expect(state.asyncData).toBe(asyncData)
      expect(state.columns).toBe(columns)
    })

    it('clears isLoading on FetchError', () => {
      const hook = setup()

      dispatch(hook, { type: TableAction.FetchStart })
      dispatch(hook, { type: TableAction.FetchError })

      expect(hook.result.current[0].isLoading).toBe(false)
    })
  })

  describe('SetSorting', () => {
    it('cycles: none → ASC → DESC → none', () => {
      const hook = setup()

      // First click: none → ASC
      dispatch(hook, { type: TableAction.SetSorting, column: mockColumn })

      expect(hook.result.current[0].sorting).toEqual({
        key: 'name',
        dir: ORDER_ASC,
      })

      // Second click: ASC → DESC
      dispatch(hook, { type: TableAction.SetSorting, column: mockColumn })

      expect(hook.result.current[0].sorting).toEqual({
        key: 'name',
        dir: ORDER_DESC,
      })

      // Third click: DESC → none
      dispatch(hook, { type: TableAction.SetSorting, column: mockColumn })

      expect(hook.result.current[0].sorting).toEqual({
        key: 'name',
        dir: '',
      })
    })

    it('resets to ASC when switching columns', () => {
      const hook = setup()
      const otherColumn = { ...mockColumn, key: 'email', text: 'Email' }

      // Sort by name ASC
      dispatch(hook, { type: TableAction.SetSorting, column: mockColumn })

      expect(hook.result.current[0].sorting.dir).toBe(ORDER_ASC)

      // Switch to email — should start at ASC, not continue cycle
      dispatch(hook, { type: TableAction.SetSorting, column: otherColumn })

      expect(hook.result.current[0].sorting).toEqual({
        key: 'email',
        dir: ORDER_ASC,
      })
    })

    it('produces a new sorting object (immutable)', () => {
      const hook = setup()
      const sortingBefore = hook.result.current[0].sorting

      dispatch(hook, { type: TableAction.SetSorting, column: mockColumn })

      const sortingAfter = hook.result.current[0].sorting

      expect(sortingAfter).not.toBe(sortingBefore)
    })
  })

  describe('SetActivePage', () => {
    it('sets the active page', () => {
      const hook = setup()

      dispatch(hook, { type: TableAction.SetActivePage, activePage: 5 })

      expect(hook.result.current[0].activePage).toBe(5)
    })
  })

  describe('ToggleColumn', () => {
    it('toggles an existing column invisible', () => {
      const headers = {
        name: { ...mockColumn, invisible: false },
      } as Headers<UnknownObject>
      const hook = setup(headers)

      dispatch(hook, { type: TableAction.ToggleColumn, key: 'name' })

      expect(hook.result.current[0].colProperties.name.invisible).toBe(true)
    })

    it('toggles back to visible', () => {
      const headers = {
        name: { ...mockColumn, invisible: false },
      } as Headers<UnknownObject>
      const hook = setup(headers)

      dispatch(hook, { type: TableAction.ToggleColumn, key: 'name' })
      dispatch(hook, { type: TableAction.ToggleColumn, key: 'name' })

      expect(hook.result.current[0].colProperties.name.invisible).toBe(false)
    })

    it('creates colProperties entry for unknown key', () => {
      const hook = setup()

      dispatch(hook, { type: TableAction.ToggleColumn, key: 'unknown' })

      expect(hook.result.current[0].colProperties.unknown).toBeDefined()
      expect(hook.result.current[0].colProperties.unknown.invisible).toBe(true)
    })

    it('does not mutate previous state', () => {
      const headers = {
        name: { ...mockColumn },
      } as Headers<UnknownObject>
      const hook = setup(headers)
      const colPropsBefore = hook.result.current[0].colProperties

      dispatch(hook, { type: TableAction.ToggleColumn, key: 'name' })

      const colPropsAfter = hook.result.current[0].colProperties

      expect(colPropsAfter).not.toBe(colPropsBefore)
      expect(colPropsAfter.name).not.toBe(colPropsBefore.name)
    })
  })

  describe('ToggleAllColumns', () => {
    it('sets all columns invisible when isChecked is true', () => {
      const columns = [
        mockColumn,
        { ...mockColumn, key: 'email', text: 'Email' },
      ]
      const hook = setup()

      dispatch(hook, {
        type: TableAction.ToggleAllColumns,
        columns,
        isChecked: true,
      })

      const { colProperties } = hook.result.current[0]

      expect(colProperties.name.invisible).toBe(true)
      expect(colProperties.email.invisible).toBe(true)
    })

    it('sets all columns visible when isChecked is false', () => {
      const columns = [mockColumn]
      const hook = setup()

      dispatch(hook, {
        type: TableAction.ToggleAllColumns,
        columns,
        isChecked: true,
      })
      dispatch(hook, {
        type: TableAction.ToggleAllColumns,
        columns,
        isChecked: false,
      })

      expect(hook.result.current[0].colProperties.name.invisible).toBe(false)
    })
  })

  describe('ResetPageForFilter', () => {
    it('resets activePage to 1 and updates prevFilterValue', () => {
      const hook = setup()

      dispatch(hook, { type: TableAction.SetActivePage, activePage: 5 })

      expect(hook.result.current[0].activePage).toBe(5)

      dispatch(hook, {
        type: TableAction.ResetPageForFilter,
        filterValue: 'search',
      })

      expect(hook.result.current[0].activePage).toBe(1)
      expect(hook.result.current[0].prevFilterValue).toBe('search')
    })
  })

  it('returns state unchanged for unknown action', () => {
    const hook = setup()
    const stateBefore = hook.result.current[0]

    act(() => {
      hook.result.current[1]({
        type: 'UNKNOWN',
      } as unknown as TableReducerAction)
    })

    expect(hook.result.current[0]).toBe(stateBefore)
  })
})
