import React, { memo } from 'react'
import type { FC, PropsWithChildren } from 'react'

interface TableComponent extends FC<
  PropsWithChildren<React.JSX.IntrinsicElements['table']>
> {
  Body: FC<PropsWithChildren<React.JSX.IntrinsicElements['tbody']>>
  Cell: FC<PropsWithChildren<React.JSX.IntrinsicElements['td']>>
  Footer: FC<PropsWithChildren<React.JSX.IntrinsicElements['tfoot']>>
  Header: FC<PropsWithChildren<React.JSX.IntrinsicElements['thead']>>
  HeaderCell: FC<PropsWithChildren<React.JSX.IntrinsicElements['th']>>
  Row: FC<PropsWithChildren<React.JSX.IntrinsicElements['tr']>>
}

const Table: TableComponent = ({ children, ...props }) => (
  <table {...props}>{children}</table>
)

const TableBody: TableComponent['Body'] = memo(({ children, ...props }) => (
  <tbody {...props}>{children}</tbody>
))

const TableCell: TableComponent['Cell'] = memo(({ children, ...props }) => (
  <td {...props}>{children}</td>
))

const TableFooter: TableComponent['Footer'] = memo(({ children, ...props }) => (
  <tfoot {...props}>{children}</tfoot>
))

const TableHeader: TableComponent['Header'] = memo(({ children, ...props }) => (
  <thead {...props}>{children}</thead>
))

const TableHeaderCell: TableComponent['HeaderCell'] = memo(
  ({ children, ...props }) => <th {...props}>{children}</th>,
)

const TableRow: TableComponent['Row'] = memo(({ children, ...props }) => (
  <tr {...props}>{children}</tr>
))

Table.Body = TableBody
Table.Cell = TableCell
Table.Footer = TableFooter
Table.Header = TableHeader
Table.HeaderCell = TableHeaderCell
Table.Row = TableRow

export default Table
