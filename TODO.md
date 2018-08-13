## 0.6.0
> work in progress

- Added the possibility to convert _true_ and _false_ to _[Yes Word]_ and
_[No Word]_ when the value is of _Boolean_ type where each can be customized
by supplying an object to the _parseBool_ prop
- Added a parser for images and the possibility to render the image instead of
displaying the URL
- Added memoization

**Breaking Changes**

- Removed the _styled_ prop deprecation warning
- Added the _footer_ deprecation warning
- Added the _withHeaders_ deprecation warning
- Added the _withFooter_ prop as the flag to render the footer in convergence
with the _withHeader_ prop
