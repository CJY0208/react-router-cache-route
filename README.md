# CacheRoute

[中文说明](https://github.com/CJY0208/react-router-cache-route/blob/master/README_CN.md)

Route with cache for `react-router` like `keep-alive` in Vue.

**React v15+**

**React-Router v4+**

---

<img src="./docs/CacheRoute.gif">

---

## Problem

Using `Route`, component can not be cached while going forward or back which lead to **losing data and interaction**

---

## Reason & Solution

Component would be unmounted when `Route` was unmatched

After reading source code of `Route` we found that using `children` prop as a function could help to control rendering behavior.

**Hiding instead of Removing** would fix this issue.

https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Route.js#L41-L63

---

## Install

```bash
npm install react-router-cache-route --save
# or
yarn add react-router-cache-route
```

---

## Usage

Replace `Route` with `CacheRoute`

Replace `Switch` with `CacheSwitch` (Because `Switch` only keeps the first matching state route and unmount the others)

```javascript
import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'

import List from './views/List'
import Item from './views/Item'

const App = () => (
  <Router>
    <CacheSwitch>
      <CacheRoute exact path="/list" component={List} />
      <Route exact path="/item/:id" component={Item} />
      <Route render={() => <div>404 Not Found</div>} />
    </CacheSwitch>
  </Router>
)

export default App
```

---

## CacheRoute props

| name      | type                  | default                                                        | description                                                                                                                    |
| --------- | --------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| when      | `String` / `Function` | `"forward"`                                                    | Decide when to cache                                                                                                           |
| className | `String`              | -                                                              | `className` prop for the wrapper component                                                                                     |
| behavior  | `Function`            | `cached => cached ? { style: { display: "none" }} : undefined` | Return `props` effective on the wrapper component to control rendering behavior                                                |
| cacheKey  | `String`              | -                                                              | For imperative control caching                                                                                                 |
| unmount   | `Boolean`             | `false`                                                        | Whether to unmount the real dom node after cached, to save performance (Will cause losing the scroll position after recovered) |

`CacheRoute` is only a wrapper component that works based on the `children` property of `Route`, and does not affect the functionality of `Route` itself.

For the rest of the properties, please refer to https://reacttraining.com/react-router/

---

### About `when`

The following values can be taken when the type is `String`

- **[forward]** Cache when **forward** behavior occurs, corresponding to the `PUSH` or `REPLACE` action in react-router
- **[back]** Cache when **back** behavior occurs, corresponding to the `POP` action in react-router
- **[always]** Always cache routes when leave, no matter forward or backward

When the type is `Function`, the component's `props` will be accepted as the first argument, return `true/false` to determine whether to cache.

---

## Lifecycles

Component with CacheRoute will accept one prop named `cacheLifecycles` which contains two functions to inject customer Lifecycle `didCache` and `didRecover`

```javascript
import React, { Component } from 'react'

export default class List extends Component {
  constructor(props) {
    super(props)

    props.cacheLifecycles.didCache(this.componentDidCache)
    props.cacheLifecycles.didRecover(this.componentDidRecover)
  }

  componentDidCache = () => {
    console.log('List cached')
  }

  componentDidRecover = () => {
    console.log('List recovered')
  }

  render() {
    return (
      // ...
    )
  }
}

```

---

## Drop cache manually

You can manually control the cache with `cacheKey` prop and `dropByCacheKey` function.

```javascript
import CacheRoute, { dropByCacheKey, getCachingKeys } from 'react-router-cache-route'

...
<CacheRoute ... cacheKey="MyComponent" />
...

console.log(getCachingKeys()) // will receive ['MyComponent'] if CacheRoute is cached which `cacheKey` prop is 'MyComponent'
...

dropByCacheKey('MyComponent')
...
```
