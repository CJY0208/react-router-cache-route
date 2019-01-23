# CacheRoute

搭配 `react-router` 工作的、带缓存功能的路由组件，类似于 `Vue` 中的 `keep-alive` 功能

**React v16+**

**React-Router v4+**

## 遇到的问题

使用 `Route` 时，路由对应的组件在前进或后退无法被缓存，导致了 **数据和行为的丢失**

例如：列表页滚动到底部后，点击跳转到详情页，返回后会回到列表页顶部，丢失了滚动位置和数据的记录

## 原因 & 解决方案

`Route` 中配置的组件在路径不匹配时会被卸载（render 方法中 return null），对应的真实节点也将从 dom 树中删除

在阅读了 `Route` 的源码后我们发现可以将 `children` 当作方法来使用，以帮助我们手动控制渲染的行为

**隐藏替代删除** 可以解决遇到的问题

https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Route.js#L42-L63

## 安装

```bash
npm install react-router-cache-route --save
```

## 使用方法

可以使用 `CacheRoute` 组件的 `component`， `render`， `children` 属性装载组件

注意：缓存语句不要写在 `Switch` 组件当中，因为 `Switch` 组件会卸载掉所有非匹配状态下的路由，需使用 `CacheSwitch` 替代 `Switch`

使用 `when` 属性决定何时使用缓存功能，可选值为 [`forward`, `back`, `always`] ，默认值为 `forward`

使用 `className` 属性给包裹组件添加自定义样式

也可以使用 `behavior` 属性来自定义缓存状态下组件的隐藏方式，工作方式是根据 `CacheRoute` 当前的缓存状态，返回一个作用于包裹组件的 `props`

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
      也可使用 render, children prop
      <CacheRoute exact path="/list" render={props => <List {...props} />} />
      或
      <CacheRoute exact path="/list">
        {props => <List {...props} />}
      </CacheRoute>
      或
      <CacheRoute exact path="/list">
        <div>
          支持多个子组件
        </div>
        <List />
      </CacheRoute>
    */}
    <CacheRoute exact path="/list" component={List} when="always" /> 
    <Switch>
      <Route exact path="/item/:id" component={Item} />
    </Switch>

    <CacheSwitch>
      <CacheRoute 
        exact 
        path="/list2" 
        component={List2} 
        className="custom-style"
        behavior={cached => (cached ? {
          style: {
            position: 'absolute',
            zIndex: -9999,
            opacity: 0,
            visibility: 'hidden',
            pointerEvents: 'none'
          },
          className: '__CacheRoute__wrapper__cached'
        } : {
          className: '__CacheRoute__wrapper__uncached'
        })}
      />
      <Route exact path="/item2/:id" component={Item2} />
      <Route
        render={() => (
          <div>404 未找到页面</div>
        )}
      />
    </CacheSwitch>
  </Router>
)

export default App
```

## 额外的生命周期

使用 `CacheRoute` 的组件将会得到一个名为 `cacheLifecycles` 的属性，里面包含两个额外生命周期的注入函数 `didCache` 和 `didRecover`，分别用在组件 **被缓存** 和 **被恢复** 时

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

## 手动清除缓存

使用 `cacheKey` prop 和 `dropByCacheKey` 函数来手动控制缓存

```javascript
import CacheRoute, { dropByCacheKey, getCachingKeys } from 'react-router-cache-route'

...
<CacheRoute ... cacheKey="MyComponent" />
...

console.log(getCachingKeys()) // 如果 `cacheKey` prop 为 'MyComponent' 的缓存路由已处于缓存状态，将得到 ['MyComponent']
...

dropByCacheKey('MyComponent')
...
```
