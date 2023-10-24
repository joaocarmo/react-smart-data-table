import { createContext, useContext } from 'react'
import defaultState from './default-state'
import type { SmartDataTableState } from '../types'

export const SmartDataTableContext =
  createContext<SmartDataTableState>(defaultState)

export const useSmartDataTableContext = () => useContext(SmartDataTableContext)
