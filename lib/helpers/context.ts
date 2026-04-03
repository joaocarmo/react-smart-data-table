import { createContext, use } from 'react'
import defaultState from './default-state'
import type { SmartDataTableState } from '../types'

export const SmartDataTableContext =
  createContext<SmartDataTableState<unknown>>(defaultState)

export const useSmartDataTableContext = () => use(SmartDataTableContext)
