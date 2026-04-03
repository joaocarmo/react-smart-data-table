import { memo, useCallback } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import CellValue from './CellValue'
import Table from './Table'
import type {
  Column,
  Headers,
  ParseBool,
  ParseImg,
  UnknownObject,
} from '../helpers/functions'
import * as utils from '../helpers/functions'

interface DataRowProps<T> {
  row: T
  rowIndex: number
  columns: Column<T>[]
  colProperties: Headers<T>
  withLinks: boolean
  filterValue: string
  parseBool: boolean | ParseBool
  parseImg: boolean | ParseImg
  onRowClick: (
    event: MouseEvent<HTMLElement>,
    rowData: T,
    rowIndex: number,
    tableData: T[],
  ) => void
  tableData: T[]
}

function DataRowInner<T = UnknownObject>({
  row,
  rowIndex,
  columns,
  colProperties,
  withLinks,
  filterValue,
  parseBool,
  parseImg,
  onRowClick,
  tableData,
}: DataRowProps<T>): ReactNode {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLTableRowElement>) => {
      onRowClick(event, row, rowIndex, tableData)
    },
    [onRowClick, row, rowIndex, tableData],
  )

  return (
    <Table.Row onClick={handleClick}>
      {columns.map((column) => {
        const thisColProps = { ...colProperties[column.key] }
        const showCol = !thisColProps.invisible
        const transformFn = thisColProps.transform

        if (!showCol) {
          return null
        }

        return (
          <Table.Cell
            data-column-name={column.key}
            key={`row-${rowIndex}-${column.key}`}
          >
            {utils.isFunction(transformFn) ? (
              transformFn(row[column.key], rowIndex, row)
            ) : (
              <CellValue
                withLinks={withLinks}
                filterValue={filterValue}
                parseBool={parseBool}
                parseImg={parseImg}
                filterable={thisColProps.filterable}
                isImg={thisColProps.isImg}
              >
                {row[column.key]}
              </CellValue>
            )}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}

const DataRow = memo(DataRowInner) as typeof DataRowInner

export default DataRow
