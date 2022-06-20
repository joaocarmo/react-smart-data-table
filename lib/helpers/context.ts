import { createContext, useContext } from 'react'
import defaultState from './default-state'
import type { SmartDataTableState } from '../types'
import * as utils from './functions'

const createSmartDataTableContext = <T = utils.UnknownObject>(
  defaultValue: SmartDataTableState<T>,
) => {
  const SmartDataTableContext =
    createContext<SmartDataTableState<T>>(defaultValue)
  const useSmartDataTableContext = () => useContext(SmartDataTableContext)

  return { SmartDataTableContext, useSmartDataTableContext }
}

export const { SmartDataTableContext, useSmartDataTableContext } =
  createSmartDataTableContext(defaultState)
