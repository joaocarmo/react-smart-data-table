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

**Bug Fixes**

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

**Bug fixes**

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
