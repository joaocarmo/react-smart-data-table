# Changelog

## 0.10.1

> Mar 22, 2021

- Improved the CI workflows
- Updated the documentation
- Updated the required React version

## 0.10.0

> Mar 2, 2021

- Added a new `dataRequestOptions` to allow passing options directly to the
  underlying `fetch` API call

## 0.9.0

> Feb 17, 2021

- Added a new `dataKeyResolver` prop that accepts custom function which takes
  the response as its only argument and returns the data
- Fixed a bug rendering the cell value introduced in the previous refactoring
- Fixed a long lasting bug regarding the `headers` prop overriding behavior
- Fixed the loader not appearing if the data was empty
- Added more tests

## no-release (2021-02-15)

> Feb 15, 2021

- Converted the CellValue component to a FC and added `React.memo` to try and
  get some performance gains

## no-release (2021-02-14)

> Feb 14, 2021

- Upgraded the codebase to the new [JSX transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)
- Removed the `memoize-one` dependency
- Cleaned up the internal code
- Refactored the dev workflow
- Changed the files with `JSX` syntax to use the `.jsx` extension
- Converted some Class Components to Functional Components
  - Toggles
- Converted some `div` elements to more semantic HTML elements
- Converted Promises to async-await
- Improved the pagination's basic CSS
- Added custom API URL to the example

### Breaking Changes

- `TableCell` was renamed to `CellValue`

## 0.8.0

> Sep 1, 2020

### Breaking Changes

- Removed the styling to a dedicated file

## no-release (2020-06-07)

> Jun 7, 2020

- Started to add component testing using _enzyme_

## no-release (2020-05-18)

> May 18, 2020

- Switched from _npm_ to _yarn_
- Updated the dependencies
- Fixed the example
- Added _GitHub_ workflows for _push_ and _PR_ to `master`

## 0.7.4

> Mar 20, 2020

- Improved the tests
- Fixes
  [Issue \#22](https://github.com/joaocarmo/react-smart-data-table/issues/22)
- Updated the dependencies due to:
  - [CVE-2020-7598](https://nvd.nist.gov/vuln/detail/CVE-2020-7598)

## no-release (2020-03-08)

> Mar 8, 2020

- Added some unit tests
- Added [husky](https://github.com/typicode/husky) for pre-commit hooks

## no-release (2020-03-07)

> Mar 7, 2020

- Updated the dependencies due to:
  - [CVE-2019-16769](https://nvd.nist.gov/vuln/detail/CVE-2019-16769)
- Improved the docs
- Added a `code of conduct`
- Added `contributing guidelines`
- Added a `pull request template`

## 0.7.3

> Oct 18, 2019

- Merged
  [Pull \#20](https://github.com/joaocarmo/react-smart-data-table/pull/20)
  to fix
  [Issue \#19](https://github.com/joaocarmo/react-smart-data-table/issues/19)
  ([\@tisoap](https://github.com/tisoap))
- Added support for the _parseImg_ option to parse Data URLs as well

## 0.7.2

> Sep 29, 2019

- Removed the deprecation warning for _footer_ and _withHeaders_
- Added the _orderedHeaders_ prop that allows to customize the headers order
- Added the _hideUnordered_ prop that allows to hide unordered headers

## 0.7.1

> Jun 20, 2019

- Updated the dependencies due to:
  - [CVE-2019-11358](https://nvd.nist.gov/vuln/detail/CVE-2019-11358)
  - [WS-2019-0032](https://github.com/nodeca/js-yaml/issues/475)
- Replaced _@babel/polyfill_ with _core-js/stable_

## 0.7.0

> Feb 4, 2019

- Added the possibility of passing a custom _Paginator_ component to render the
  pagination
- Removed the _segmentize_ dependency

## 0.6.7

> Dec 25, 2018

- Removed the _lodash_ dependency completely
- Fixed a bug where the rows, when filtered, would cause the sorting to not work
- Didn't change the behavior where the _index_ passed down to _transform_
  function in the _headers_ does not correspond to the index of the original data,
  but of the sorted data instead, because a different algorithm can be used to
  achieve the same result (example in the documentation)

## 0.6.6

> Dec 20, 2018

- Fixes [Issue \#14](https://github.com/joaocarmo/react-smart-data-table/issues/14)

## 0.6.5

> Oct 10, 2018

- Added the prop _emptyTable_ to display a message when the table is empty
  (Fixes [Issue \#13](https://github.com/joaocarmo/react-smart-data-table/issues/13))

## 0.6.4

> Sep 28, 2018

- Added _transform_ and _isImage_ properties to the _headers_ prop accepted
  options

## 0.6.3

> Sep 28, 2018

- Added prop to pass custom _header_ prop with options to override individual
  columns default behavior
- Added the _dynamic_ prop
- Added a _.npmignore_ file to reduce the package size by excluding examples
  and tests

## 0.6.2

> Sep 6, 2018

- Removed the _Python_ dependency and replaced the development server with
  _webpack-dev-server_
- Updated the _webpack_ configuration for the new _babel-loader_
- Helper functions improvements

## 0.6.1

> Sep 5, 2018

- Fixes [Issue \#12](https://github.com/joaocarmo/react-smart-data-table/issues/12)

## 0.6.0

> Aug 29, 2018

- Webpack reorganization
- Package structure reorganization

### Breaking Changes

- Removed the _styled_ prop deprecation warning
- Added the _footer_ deprecation warning
- Added the _withHeaders_ deprecation warning
- Added the _withFooter_ prop as the flag to render the footer in convergence
  with the _withHeader_ prop

_Note_: This version is exactly the same as `0.5.15` with some props name
changes. If this breaks your app, keep using the previous version.

## 0.5.15

> Aug 19, 2018

- Added _className_ to options that can be provided to _parseImg_ to be passed
  down to the _img_ tag
- Several minor enhancements, bug fixes and code reduction
- Added memoization through [memoize-one](https://github.com/alexreardon/memoize-one)

## 0.5.14

> Aug 19, 2018

- Added a parser for images and the possibility to render the image instead of
  displaying the URL which also accepts an object with a _style_ key containing a
  _style object_ which will be passed down to the `<img />` tag with the CSS
  attributes as defined in
  [Common CSS Properties Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference)

### Bug Fixes

- Stopped the event propagation to _onRowClick_ when links rendered with
  _withLinks_ are clicked

## 0.5.13

> Aug 14, 2018

- Added the possibility to convert _true_ and _false_ to _[Yes Word]_ and
  _[No Word]_ when the value is of _Boolean_ type where each can be customized
  by supplying an object to the _parseBool_ prop

## 0.5.12

> Aug 14, 2018

- Added the possibility to convert _true_ and _false_ to _Yes_ and _No_ when the
  value is of _Boolean_ type through the _parseBool_ prop

## 0.5.11

> Aug 12, 2018

- Added _onRowClick_ prop, check the [README](README.md) for the function
  signature (courtesy of [occult](https://github.com/occult))

## 0.5.10

> Aug 1, 2018

## Bug fixes

- When filtering by value, reset the page (pagination) back to 1

## 0.5.9

> Jul 23, 2018

- Added a condition to reload the async data if the URL changes

## 0.5.8

> Jul 18, 2018

- The RSDT now correctly re-renders when data is changed in props and the loader
  is correctly called, it also correctly re-renders even when the data type is
  changed

## 0.5.7

> Jun 24, 2018

- Added ESLint with babel-eslint and eslint-config-airbnb
- Added a new prop for a _loader_ component to be rendered while fetching async
  data
- Added intelligence to parse boolean values

## 0.5.6

> Jun 10, 2018

- Added async data loading from remote url

## 0.5.5

> Apr 30, 2018

- Added an [Error Boundary](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html#introducing-error-boundaries)

## 0.5.4

> Apr 25, 2018

- Exposed the library as a compiled bundle in order to avoid import errors due
  to the ES6 syntax

## 0.5.3

> Apr 2, 2018

- Added the prop _withHeaders_ (courtesy of [Derush](https://github.com/Derush))

## 0.5.2

> Mar 18, 2018

- Tested and updated the dependencies, will bring improvements very soon

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
- Added _withLinks_ prop that detects and converts links to `<a />` tags
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
