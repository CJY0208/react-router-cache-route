import React from 'react'
import PropTypes from 'prop-types'
import { Switch, matchPath } from 'react-router-dom'

import { isNull } from '../helpers/is'
import { get } from '../helpers/try'
import { isReactV16plus } from '../helpers/util'

export default class CacheSwitch extends Switch {
  static contextTypes = {
    router: PropTypes.shape({
      route: PropTypes.object.isRequired
    }).isRequired
  }

  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object
  }

  render() {
    const { route } = this.context.router
    const { children } = this.props
    const location = this.props.location || route.location

    let __matched__already = false



    let component = React.Children.map(children, element => {
      if (!React.isValidElement(element)) {
        return null
      }

      const { path: pathProp, exact, strict, sensitive, from } = element.props
      const path = pathProp || from
      const match = __matched__already
        ? null
        : matchPath(
          location.pathname,
          { path, exact, strict, sensitive },
          route.match
        )

      let child
      switch (get(element, 'type.componentName')) {
        case 'CacheRoute':
          child = React.cloneElement(element, {
            location,
            /**
             * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Route.js#L57
             *
             * Note:
             * Route would use computedMatch as its next match state ONLY when computedMatch is a true value
             * So here we have to do some trick to let the unmatch result pass Route's computedMatch check
             *
             * 注意：只有当 computedMatch 为真值时，Route 才会使用 computedMatch 作为其下一个匹配状态
             * 所以这里我们必须做一些手脚，让 unmatch 结果通过 Route 的 computedMatch 检查
             */
            computedMatch: isNull(match)
              ? {
                __CacheRoute__computedMatch__null: true
              }
              : match
          })
          break
        default:
          child =
            match && !__matched__already
              ? React.cloneElement(element, { location, computedMatch: match })
              : null
      }

      if (!__matched__already) {
        __matched__already = !!match
      }

      return child
    })

    if (!isReactV16plus) {
      component = <div>{component}</div>
    }

    return component;

  }
}
