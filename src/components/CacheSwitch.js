import React from 'react'
import PropTypes from 'prop-types'
import {
  Switch,
  matchPath,
  withRouter,
  __RouterContext
} from 'react-router-dom'

import SwitchFragment from './SwitchFragment'
import { isNull, isExist } from '../helpers/is'
import { get, value } from '../helpers/try'

const isUsingNewContext = isExist(__RouterContext)

class CacheSwitch extends Switch {
  getContext = () => {
    if (isUsingNewContext) {
      const { location, match } = this.props

      return { location, match }
    } else {
      const { route } = this.context.router
      const location = this.props.location || route.location

      return {
        location: this.props.location || route.location,
        match: route.match
      }
    }
  }

  render() {
    const { children } = this.props
    const { location, match: contextMatch } = this.getContext()

    let __matched__already = false

    return (
      <SwitchFragment>
        {React.Children.map(children, element => {
          if (!React.isValidElement(element)) {
            return null
          }

          const path = element.props.path || element.props.from
          const match = __matched__already
            ? null
            : path
              ? matchPath(
                  location.pathname,
                  {
                    ...element.props,
                    path
                  },
                  contextMatch
                )
              : contextMatch

          let child
          switch (value(
            get(element, 'type.componentName'),
            get(element, 'type.displayName')
          )) {
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
                  ? React.cloneElement(element, {
                      location,
                      computedMatch: match
                    })
                  : null
          }

          if (!__matched__already) {
            __matched__already = !!match
          }

          return child
        })}
      </SwitchFragment>
    )
  }
}

if (isUsingNewContext) {
  CacheSwitch.propTypes = {
    children: PropTypes.node,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  }

  CacheSwitch = withRouter(CacheSwitch)
} else {
  CacheSwitch.contextTypes = {
    router: PropTypes.shape({
      route: PropTypes.object.isRequired
    }).isRequired
  }

  CacheSwitch.propTypes = {
    children: PropTypes.node,
    location: PropTypes.object
  }
}

export default CacheSwitch
