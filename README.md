# CacheRoute

[中文说明](https://github.com/CJY0208/react-router-cache-route/blob/master/README_CN.md)

Route with cache for `react-router` like `keep-alive` in Vue.

~~Will cache the Route **ONLY** while going forward~~

~~React v16.3+~~ (Compatible React 16.3- now)

**React-Router v4+**

## Problem

Using `Route`, component can not be cached while going forward or back which lead to **losing data and interaction**

## Reason & Solution

Component would be unmounted when `Route` was unmatched 

After reading source code of `Route` we found that using `children` prop as a function could help to control rendering behavior.

**Hiding instead of Removing** would fix this issue.

https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Route.js#L118-L127

## Install

```bash
npm install react-router-cache-route --save
```

## Usage

Can use `CacheRoute` with `component`, `render`, `children` prop, ~~or~~

~~Using `cacheComponent` work with `Route`'s `children` prop~~

**DO NOT** put it in `Switch` component, use `CacheSwitch` instead

Use `when` prop to decide when you need to use the cache, the optional value is [`forward`, `back`, `always`] , `forward` default

Use `className` prop for adding custom style to cache wrapper component

```javascript
import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'

import List from './components/List'
import Item from './components/Item'

import List2 from './components/List2'
import Item2 from './components/Item2'

const App = () => (
  <Router>
    {/* 
      Can also use render, children props
      <CacheRoute exact path="/list" render={props => <List {...props} />} />
      or 
      <CacheRoute exact path="/list">
        {props => <List {...props} />}
      </CacheRoute>
      or
      <CacheRoute exact path="/list">
        <div>
          Support muiltple children
        </div>
        <List />
      </CacheRoute>
    */}
    <CacheRoute exact path="/list" component={List} when="always" /> 
    <Switch>
      <Route exact path="/item/:id" component={Item} />
    </Switch>

    <CacheSwitch>
      <CacheRoute exact path="/list2" component={List2} className="custom-style"/>
      <Route exact path="/item2/:id" component={Item2} />
      <Route
        render={() => (
          <div>404 Not Found</div>
        )}
      />
    </CacheSwitch>
  </Router>
)

export default App
```

## Lifecycles

Component with CacheRoute will accept one prop named `cacheLifecycles` which contains two functions to inject customer Lifecycle `didCache` and `didRecover`

```javascript
import React, { Component } from 'react'

export default class List extends Component {
  constructor(props, ...args) {
    super(props, ...args)

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

