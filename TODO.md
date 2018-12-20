## 0.7.0
> work in progress

- Added option to pass _first_, _next_, _previous_ and _last_ words to be
rendered in the pagination
- Improve performance
- Fix a bug when the rows where being filtered the sorting function did not
work
- Allow custom elements: _Paginate_, _ErrorBoundary_, _Toggles_, _TableCell_
- Remove _segmentize_ dependency
- Fix the bug where the _index_ passed down to _transform_ function in the
_headers_ does not mimic the true index when the data is sorted
