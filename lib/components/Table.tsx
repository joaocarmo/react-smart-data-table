import PropTypes from 'prop-types'

const commonPropTypes = {
  children: PropTypes.node,
}

const defaultPropTypes = {
  children: null,
}

const Table = ({ children, ...props }) => <table {...props}>{children}</table>
const TableBody = ({ children, ...props }) => (
  <tbody {...props}>{children}</tbody>
)
const TableCell = ({ children, ...props }) => <td {...props}>{children}</td>
const TableFooter = ({ children, ...props }) => (
  <tfoot {...props}>{children}</tfoot>
)
const TableHeader = ({ children, ...props }) => (
  <thead {...props}>{children}</thead>
)
const TableHeaderCell = ({ children, ...props }) => (
  <th {...props}>{children}</th>
)
const TableRow = ({ children, ...props }) => <tr {...props}>{children}</tr>

Table.propTypes = commonPropTypes
TableBody.propTypes = commonPropTypes
TableCell.propTypes = commonPropTypes
TableFooter.propTypes = commonPropTypes
TableHeader.propTypes = commonPropTypes
TableHeaderCell.propTypes = commonPropTypes
TableRow.propTypes = commonPropTypes

Table.defaultProps = defaultPropTypes
TableBody.defaultProps = defaultPropTypes
TableCell.defaultProps = defaultPropTypes
TableFooter.defaultProps = defaultPropTypes
TableHeader.defaultProps = defaultPropTypes
TableHeaderCell.defaultProps = defaultPropTypes
TableRow.defaultProps = defaultPropTypes

Table.Body = TableBody
Table.Cell = TableCell
Table.Footer = TableFooter
Table.Header = TableHeader
Table.HeaderCell = TableHeaderCell
Table.Row = TableRow

export default Table
