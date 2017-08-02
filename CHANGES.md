## 0.5.1
> Aug 2, 2017

- Highlighting text now works with _withLinks_
- Added pagination with ellipsis for large amounts of data
- Added deprecation warning for _styled_ prop

## 0.5.0
> Jul 25, 2017

- Complete re-write of the whole component, makes the internal gears more
flexible for future improvements
- Removed the _styled_ prop and the ability to render the table using _div_'s
- Removed sorting by clicking on table header
- Added sorting by clicking on table header sorting icon
- Added different icons to represent sorting directions
- Added string highlight to search filter
- Added _withLinks_ prop that detects and converts links to <a /> tags
- Column toggles no longer require the custom component, it's built-in
- Added example with per page dropdown selection
- Converted pagination _span_ tags to _a_ tags

## 0.4.1
> May 27, 2017

- Fixed a bug where the visibility toggles wouldn't function introduced by the
pagination support

## 0.4.0
> May 26, 2017

- Added pagination support

## 0.3.4
> May 6, 2017

- Package dependencies updated

## 0.3.3
> Apr 25, 2017

- Fixed the toggles and sorting compatibility bug
- Added documentation for toggles

## 0.3.2
> Apr 24, 2017

- Added column visibility toggles
  - Bug: need to fix compatibility with sorting

## 0.3.1
> Apr 23, 2017

- Fixed a bug where sorting would reset the filtering
- Added a filtering example to _README.md_

## 0.3.0
> Apr 21, 2017

- Added filtering of all columns through a new prop _filterValue_ that accepts
a string input as the value to use for the filter

## 0.2.3
> Apr 15, 2017

- Added live examples to _README.md_

## 0.2.2
> Apr 15, 2017

- Added PropTypes from the _prop-types_ npm module instead of the main _react_

## 0.2.1
> Mar 26, 2017

- Added SmartDataTable as a default export

## 0.2.0
> Mar 25, 2017

- Added sortable option to make the table sortable by individual columns

## 0.1.0
> Mar 11, 2017

- Added support for nested objects and for more header formats
- Added _lodash_ dependency
- Started to document the code, updated the _README.md_

## 0.0.1
> Feb 12, 2017

- Wrote most of the logic for the smart data table

## 0.0.0
> Jan 30, 2017

- Created the index export and wrote the basic react component structure
- Created the environment for proper development and testing
