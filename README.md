# CacheRoute

Route with cache for `react-router` like `keep-alive` in Vue.

Will cache the Route ONLY WHILE GOING FOWARD

**React v16.3+**

**React-Router v4+**

## Install

```bash
npm install react-router-cache-route --save
```
or 

```bash
yarn add react-router-cache-route
```

## Usage

Can use `CacheRoute`, or

Using `cacheComponent` work with `Route`'s `children` prop 

**DO NOT PUT IT IN `Switch` COMPONENT**

```javascript
import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router'
import CacheRoute, { cacheComponent } from 'react-router-cache-route'

import List from './components/List'
import Item from './components/Item'

import List2 from './components/List2'
import Item2 from './components/Item2'

const App = () => (
  <Router>
    <CacheRoute exact path="/list" component={List} />
    <Route exact path="/list2" children={cacheComponent(List2)} />
    <Switch>
      <Route exact path="/item/:id" component={Item} />
      <Route exact path="/item2/:id" component={Item2} />
    </Switch>
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

