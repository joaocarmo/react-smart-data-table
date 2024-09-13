import type { FC, PropsWithChildren } from 'react'

interface TableComponent
  extends FC<PropsWithChildren<JSX.IntrinsicElements['table']>> {
  Body: FC<PropsWithChildren<JSX.IntrinsicElements['tbody']>>
  Cell: FC<PropsWithChildren<JSX.IntrinsicElements['td']>>
  Footer: FC<PropsWithChildren<JSX.IntrinsicElements['tfoot']>>
  Header: FC<PropsWithChildren<JSX.IntrinsicElements['thead']>>
  HeaderCell: FC<PropsWithChildren<JSX.IntrinsicElements['th']>>
  Row: FC<PropsWithChildren<JSX.IntrinsicElements['tr']>>
}

const Table: TableComponent = ({ children, ...props }) => (
  <table {...props}>{children}</table>
)

const TableBody: TableComponent['Body'] = ({ children, ...props }) => (
  <tbody {...props}>{children}</tbody>
)

const TableCell: TableComponent['Cell'] = ({ children, ...props }) => (
  <td {...props}>{children}</td>
)

const TableFooter: TableComponent['Footer'] = ({ children, ...props }) => (
  <tfoot {...props}>{children}</tfoot>
)

const TableHeader: TableComponent['Header'] = ({ children, ...props }) => (
  <thead {...props}>{children}</thead>
)

const TableHeaderCell: TableComponent['HeaderCell'] = ({
  children,
  ...props
}) => <th {...props}>{children}</th>

const TableRow: TableComponent['Row'] = ({ children, ...props }) => (
  <tr {...props}>{children}</tr>
)

Table.Body = TableBody
Table.Cell = TableCell
Table.Footer = TableFooter
Table.Header = TableHeader
Table.HeaderCell = TableHeaderCell
Table.Row = TableRow

export default Table
