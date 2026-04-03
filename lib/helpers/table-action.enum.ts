enum TableAction {
  FetchStart = 'FETCH_START',
  FetchSuccess = 'FETCH_SUCCESS',
  FetchError = 'FETCH_ERROR',
  SetSorting = 'SET_SORTING',
  SetActivePage = 'SET_ACTIVE_PAGE',
  SetColProperties = 'SET_COL_PROPERTIES',
  ToggleColumn = 'TOGGLE_COLUMN',
  ToggleAllColumns = 'TOGGLE_ALL_COLUMNS',
  ResetPageForFilter = 'RESET_PAGE_FOR_FILTER',
}

export default TableAction
